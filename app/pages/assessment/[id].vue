<script setup lang="ts">
import useApi from "~/composables/useApi";
import useDateFormat from "~/composables/useDateFormat";
import { getAssessmentTypeLabel } from "~/utils/assessmentTypes";
import EditAssessmentModal from "~/components/modals/EditAssessmentModal.vue";
import DeleteConfirmationModal from "~/components/modals/DeleteConfirmationModal.vue";
import TextDisplay from "~/components/TextDisplay.vue";
import PageLoader from "~/components/UI/PageLoader.vue";
import PageError from "~/components/UI/PageError.vue";
import ActionButtons from "~/components/UI/ActionButtons.vue";
import PositionDetailsCard from "~/components/PositionDetailsCard.vue";
import type { Assessment, Position, Application, AssessmentWithPosition } from "~/assets/types/database";
import backDashboard from "~/components/UI/backDashboard.vue";

definePageMeta({
  layout: "default",
});

const route = useRoute();
const assessmentId = route.params.id as string;

const assessment = ref<Assessment | null>(null);
const position = ref<Position | null>(null);
const application = ref<Application | null>(null);
const positionAssessments = ref<Assessment[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Modal states
const editAssessmentModalOpen = ref(false);
const deleteModalOpen = ref(false);

const { formatDate, formatDateTime } = useDateFormat();

const assessmentTitle = computed(() => {
  const round = assessment.value?.round || "N/A";
  const typeLabel = getAssessmentTypeLabel(assessment.value?.assessment_type);
  return `Round ${round} - ${typeLabel}`;
});

const loadAssessmentData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Fetch assessment
    const assessmentResult = await useApi.getAssessment(assessmentId);
    if (assessmentResult.error) {
      error.value = assessmentResult.error.error;
      loading.value = false;
      return;
    }
    
    if (!assessmentResult.data) {
      error.value = "Assessment not found";
      loading.value = false;
      return;
    }
    
    assessment.value = assessmentResult.data;
    
    // Fetch position if position_id exists
    if (assessmentResult.data.position_id) {
      const [positionResult, assessmentsResult] = await Promise.all([
        useApi.getPosition(assessmentResult.data.position_id),
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
    error.value = e instanceof Error ? e.message : "Failed to load assessment";
    console.error("Error loading assessment:", e);
  } finally {
    loading.value = false;
  }
};

const assessmentWithPosition = computed((): AssessmentWithPosition | null => {
  if (!assessment.value || !position.value) return null;
  return {
    assessment: assessment.value,
    position: position.value,
  };
});

const handleEdit = () => {
  editAssessmentModalOpen.value = true;
};

const handleDelete = () => {
  deleteModalOpen.value = true;
};

const handleAssessmentModalSaved = async () => {
  editAssessmentModalOpen.value = false;
  await loadAssessmentData();
};

const confirmDelete = async () => {
  if (!assessment.value?.id) return;

  const assessmentToDelete = assessment.value;
  const assessmentIdToDelete = assessmentToDelete.id;

  if (!assessmentIdToDelete) return;

  try {
    const result = await useApi.deleteAssessment(assessmentIdToDelete);
    if (result.error) {
      console.error("Error deleting assessment:", result.error);
      alert(`Failed to delete assessment: ${result.error.error}`);
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
  loadAssessmentData();
});
</script>

<template>
  <div class="min-h-screen p-6">
    <PageLoader v-if="loading" />
    <PageError v-else-if="error" :error="error" />
    <div v-else-if="assessment" class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <backDashboard/>
      
      <!-- Assessment Details -->
      <div class="glass-card bg-white/20 p-6 rounded-lg mb-6">
        <div class="flex justify-between items-start mb-6">
          <h1 class="text-2xl font-bold text-white/90">Assessment Details</h1>
          <ActionButtons @edit="handleEdit" @delete="handleDelete" />
        </div>
        
        <div class="space-y-4 text-white/90">
          <div>
            <span class="font-semibold">Assessment: </span>
            <span class="text-lg">{{ assessmentTitle }}</span>
          </div>
          
          <div>
            <span class="font-semibold">Date & Time: </span>
            <span>{{ formatDateTime(assessment.date) }}</span>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="font-semibold">Status: </span>
            <button
              @click="handleEdit"
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                assessment.completed
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-orange-100 text-orange-800 hover:bg-orange-200',
              ]"
            >
              {{ assessment.completed ? "Completed" : "Uncompleted" }}
            </button>
          </div>
          
          <div v-if="assessment.pre_notes" class="mt-4">
            <span class="font-semibold block mb-2">Pre-notes: </span>
            <div class="text-white/90 bg-black/10 p-4 rounded-lg">
              <TextDisplay :text="assessment.pre_notes" title="Pre-notes" />
            </div>
          </div>
          
          <div v-if="assessment.post_notes" class="mt-4">
            <span class="font-semibold block mb-2">Post-notes: </span>
            <div class="text-white/90 bg-black/10 p-4 rounded-lg">
              <TextDisplay :text="assessment.post_notes" title="Post-notes" />
            </div>
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
    <EditAssessmentModal
      :item="assessmentWithPosition"
      :is-open="editAssessmentModalOpen"
      @close="editAssessmentModalOpen = false"
      @saved="handleAssessmentModalSaved"
    />

    <DeleteConfirmationModal
      :is-open="deleteModalOpen"
      :company-name="deleteCompanyName"
      item-type="assessment"
      @confirm="confirmDelete"
      @cancel="deleteModalOpen = false"
    />
  </div>
</template>

