<script setup lang="ts">
import useApi from "~/composables/useApi";
import useDateFormat from "~/composables/useDateFormat";
import EditOfferModal from "~/components/modals/EditOfferModal.vue";
import DeleteConfirmationModal from "~/components/modals/DeleteConfirmationModal.vue";
import TextDisplay from "~/components/TextDisplay.vue";
import PageLoader from "~/components/UI/PageLoader.vue";
import PageError from "~/components/UI/PageError.vue";
import ActionButtons from "~/components/UI/ActionButtons.vue";
import PositionDetailsCard from "~/components/PositionDetailsCard.vue";
import type { Offer, Position, Application, OfferWithPosition, Assessment } from "~/assets/types/database";
import backDashboard from "~/components/UI/backDashboard.vue";

definePageMeta({
  layout: "default",
});

const route = useRoute();
const offerId = route.params.id as string;

const offer = ref<Offer | null>(null);
const position = ref<Position | null>(null);
const application = ref<Application | null>(null);
const positionAssessments = ref<Assessment[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Modal states
const editOfferModalOpen = ref(false);
const deleteModalOpen = ref(false);

const { formatDate, formatDateTime } = useDateFormat();

const loadOfferData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Fetch offer
    const offerResult = await useApi.getOffer(offerId);
    if (offerResult.error) {
      error.value = offerResult.error.error;
      loading.value = false;
      return;
    }
    
    if (!offerResult.data) {
      error.value = "Offer not found";
      loading.value = false;
      return;
    }
    
    offer.value = offerResult.data;
    
    // Fetch position if position_id exists
    if (offerResult.data.position_id) {
      const [positionResult, assessmentsResult] = await Promise.all([
        useApi.getPosition(offerResult.data.position_id),
        useApi.getAssessments(),
      ]);
      
      if (positionResult.data) {
        position.value = positionResult.data;
        
        // Get assessments for this position
        positionAssessments.value = assessmentsResult.data?.filter(
          (assessment) => assessment.position_id === position.value?.id
        ) || [];
        
        // Fetch application if position exists
        const applicationResult = await useApi.getApplications();
        application.value =
          applicationResult.data?.find(
            (app) => app.position_id === position.value?.id
          ) || null;
      }
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to load offer";
    console.error("Error loading offer:", e);
  } finally {
    loading.value = false;
  }
};

const offerWithPosition = computed((): OfferWithPosition | null => {
  if (!offer.value || !position.value) return null;
  return {
    offer: offer.value,
    position: position.value,
  };
});

const handleEdit = () => {
  editOfferModalOpen.value = true;
};

const handleDelete = () => {
  deleteModalOpen.value = true;
};

const handleOfferModalSaved = async () => {
  editOfferModalOpen.value = false;
  await loadOfferData();
};

const confirmDelete = async () => {
  if (!offer.value?.id) return;

  const offerToDelete = offer.value;
  const offerIdToDelete = offerToDelete.id;

  if (!offerIdToDelete) return;

  try {
    const result = await useApi.deleteOffer(offerIdToDelete);
    if (result.error) {
      console.error("Error deleting offer:", result.error);
      alert(`Failed to delete offer: ${result.error.error}`);
      return;
    }

    // Navigate to dashboard after successful deletion
    deleteModalOpen.value = false;
    navigateTo("/");
  } catch (e) {
    console.error("Error deleting:", e);
    alert("An error occurred while deleting");
  }
};

const deleteCompanyName = computed(() => {
  return position.value?.company_name || "Unknown Company";
});

onMounted(() => {
  loadOfferData();
});
</script>

<template>
  <div class="min-h-screen p-6">
    <PageLoader v-if="loading" />
    <PageError v-else-if="error" :error="error" />
    <div v-else-if="offer" class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <backDashboard/>
      
      <!-- Offer Details -->
      <div class="glass-card bg-white/20 p-6 rounded-lg mb-6">
        <div class="flex justify-between items-start mb-6">
          <h1 class="text-2xl font-bold text-white/90">Offer Details</h1>
          <ActionButtons @edit="handleEdit" @delete="handleDelete" />
        </div>
        
        <div class="space-y-4 text-white/90">
          <div>
            <span class="font-semibold">Position: </span>
            <span class="text-lg">{{ position?.position_name || "Untitled Position" }}</span>
          </div>
          
          <div>
            <span class="font-semibold">Company: </span>
            <span class="text-lg">{{ position?.company_name || "Unknown Company" }}</span>
          </div>
          
          <div>
            <span class="font-semibold">Received Date & Time: </span>
            <span>{{ formatDateTime(offer.received_at) }}</span>
          </div>
          
          <div class="flex items-center gap-2">
            <span
              class="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
            >
              Offer Received
            </span>
          </div>
        </div>
      </div>
      
      <!-- Position/Company Details -->
      <PositionDetailsCard
        v-if="position"
        :position="position"
        :application="application"
        :position-assessments="positionAssessments"
      />
    </div>

    <!-- Modals -->
    <EditOfferModal
      :item="offerWithPosition"
      :is-open="editOfferModalOpen"
      @close="editOfferModalOpen = false"
      @saved="handleOfferModalSaved"
    />

    <DeleteConfirmationModal
      :is-open="deleteModalOpen"
      :company-name="deleteCompanyName"
      item-type="offer"
      @confirm="confirmDelete"
      @cancel="deleteModalOpen = false"
    />
  </div>
</template>

