<script setup lang="ts">
import useApi from "~/composables/useApi";
import EditOfferModal from "~/components/modals/EditOfferModal.vue";
import DeleteConfirmationModal from "~/components/modals/DeleteConfirmationModal.vue";
import TextDisplay from "~/components/TextDisplay.vue";
import type { Offer, Position, Application, OfferWithPosition } from "~/assets/types/database";
import backDashboard from "~/components/UI/backDashboard.vue";

definePageMeta({
  layout: "default",
});

const route = useRoute();
const offerId = route.params.id as string;

const offer = ref<Offer | null>(null);
const position = ref<Position | null>(null);
const application = ref<Application | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Modal states
const editOfferModalOpen = ref(false);
const deleteModalOpen = ref(false);

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

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
      const positionResult = await useApi.getPosition(
        offerResult.data.position_id
      );
      if (positionResult.data) {
        position.value = positionResult.data;
        
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
    <div v-if="loading" class="flex items-center justify-center h-screen">
      <div class="glass-card p-8 rounded-2xl">
        <div class="flex flex-col items-center gap-4">
          <div
            class="animate-spin rounded-full h-16 w-16 border-b-4 border-black/80"
          ></div>
          <p class="text-xl font-bold text-black/80">Loading...</p>
        </div>
      </div>
    </div>
    
    <div v-else-if="error" class="flex items-center justify-center h-screen">
      <div class="glass-card p-8 rounded-2xl">
        <p class="text-xl font-bold text-red-600">{{ error }}</p>
        <button
          @click="navigateTo('/')"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    </div>
    
    <div v-else-if="offer" class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <backDashboard/>
      
      <!-- Offer Details -->
      <div class="glass-card bg-white/20 p-6 rounded-lg mb-6">
        <div class="flex justify-between items-start mb-6">
          <h1 class="text-2xl font-bold text-white/90">Offer Details</h1>
          <div class="flex gap-2">
            <button
              @click="handleEdit"
              class="px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30 border border-white/30 transition-colors"
            >
              Edit
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-500/20 text-white rounded hover:bg-red-500/30 border border-red-400/40 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
        
        <div class="space-y-4 text-white/90">
          <div>
            <span class="font-semibold">Received Date & Time: </span>
            <span>{{ formatDateTime(offer.received_at) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Position/Company Details -->
      <div v-if="position" class="glass-card bg-white/20 p-6 rounded-lg">
        <h2 class="text-2xl font-bold text-white/90 mb-6">Position & Company</h2>
        
        <div class="space-y-4 text-white/90">
          <div>
            <h3 class="text-xl font-semibold mb-2">
              {{ position.position_name || "Untitled Position" }}
            </h3>
            <p class="text-lg text-white/80 mb-4">
              {{ position.company_name || "Unknown Company" }}
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span class="font-semibold">Location: </span>
              <span>{{ position.location || "Not specified" }}</span>
            </div>
            
            <div v-if="position.applied_date">
              <span class="font-semibold">Applied Date: </span>
              <span>{{ formatDate(position.applied_date) }}</span>
            </div>
            
            <div v-if="position.applied_deadline">
              <span class="font-semibold">Application Deadline: </span>
              <span>{{ formatDate(position.applied_deadline) }}</span>
            </div>
            
            <div>
              <span class="font-semibold">Status: </span>
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  position.rejected
                    ? 'bg-red-100 text-red-800'
                    : application
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{
                  position.rejected
                    ? "Rejected"
                    : application
                      ? "Applied"
                      : "Saved"
                }}
              </span>
            </div>
            
            <div v-if="position.company_notes" class="md:col-span-2">
              <span class="font-semibold">Company Notes: </span>
              <div class="mt-1 text-white/70">
                <TextDisplay :text="position.company_notes" title="Company Notes" />
              </div>
            </div>
          </div>
          
          <div v-if="position.id" class="mt-4">
            <button
              @click="navigateTo(`/position/${position.id}`)"
              class="px-4 py-2 glass-card text-white rounded hover:bg-white/50 transition-colors"
            >
              View Full Position Details &#8669
            </button>
          </div>
        </div>
      </div>
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

