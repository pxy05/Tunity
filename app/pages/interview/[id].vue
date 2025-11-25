<script setup lang="ts">
import useApi from "~/composables/useApi";
import useDateFormat from "~/composables/useDateFormat";
import EditInterviewModal from "~/components/modals/EditInterviewModal.vue";
import DeleteConfirmationModal from "~/components/modals/DeleteConfirmationModal.vue";
import TextDisplay from "~/components/TextDisplay.vue";
import PageLoader from "~/components/UI/PageLoader.vue";
import PageError from "~/components/UI/PageError.vue";
import ActionButtons from "~/components/UI/ActionButtons.vue";
import PositionDetailsCard from "~/components/PositionDetailsCard.vue";
import type { Interview, Position, Application, InterviewWithPosition } from "~/assets/types/database";
import backDashboard from "~/components/UI/backDashboard.vue";

definePageMeta({
  layout: "default",
});

const route = useRoute();
const interviewId = route.params.id as string;

const interview = ref<Interview | null>(null);
const position = ref<Position | null>(null);
const application = ref<Application | null>(null);
const positionInterviews = ref<Interview[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Modal states
const editInterviewModalOpen = ref(false);
const deleteModalOpen = ref(false);

const { formatDate, formatDateTime } = useDateFormat();

const loadInterviewData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Fetch interview
    const interviewResult = await useApi.getInterview(interviewId);
    if (interviewResult.error) {
      error.value = interviewResult.error.error;
      loading.value = false;
      return;
    }
    
    if (!interviewResult.data) {
      error.value = "Interview not found";
      loading.value = false;
      return;
    }
    
    interview.value = interviewResult.data;
    
    // Fetch position if position_id exists
    if (interviewResult.data.position_id) {
      const [positionResult, interviewsResult] = await Promise.all([
        useApi.getPosition(interviewResult.data.position_id),
        useApi.getInterviews(),
      ]);
      
      if (positionResult.data) {
        position.value = positionResult.data;
        
        // Get interviews for this position
        positionInterviews.value = interviewsResult.data?.filter(
          (interview) => interview.position_id === position.value?.id
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
    error.value = e instanceof Error ? e.message : "Failed to load interview";
    console.error("Error loading interview:", e);
  } finally {
    loading.value = false;
  }
};

const interviewWithPosition = computed((): InterviewWithPosition | null => {
  if (!interview.value || !position.value) return null;
  return {
    interview: interview.value,
    position: position.value,
  };
});

const handleEdit = () => {
  editInterviewModalOpen.value = true;
};

const handleDelete = () => {
  deleteModalOpen.value = true;
};

const handleInterviewModalSaved = async () => {
  editInterviewModalOpen.value = false;
  await loadInterviewData();
};

const confirmDelete = async () => {
  if (!interview.value?.id) return;

  const interviewToDelete = interview.value;
  const interviewIdToDelete = interviewToDelete.id;

  if (!interviewIdToDelete) return;

  try {
    const result = await useApi.deleteInterview(interviewIdToDelete);
    if (result.error) {
      console.error("Error deleting interview:", result.error);
      alert(`Failed to delete interview: ${result.error.error}`);
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
  loadInterviewData();
});
</script>

<template>
  <div class="min-h-screen p-6">
    <PageLoader v-if="loading" />
    <PageError v-else-if="error" :error="error" />
    <div v-else-if="interview" class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <backDashboard/>
      
      <!-- Interview Details -->
      <div class="glass-card bg-white/20 p-6 rounded-lg mb-6">
        <div class="flex justify-between items-start mb-6">
          <h1 class="text-2xl font-bold text-white/90">Interview Details</h1>
          <ActionButtons @edit="handleEdit" @delete="handleDelete" />
        </div>
        
        <div class="space-y-4 text-white/90">
          <div class="flex items-center gap-2">
            <span class="font-semibold">Round: </span>
            <span class="text-lg">{{ interview.round || "N/A" }}</span>
          </div>
          
          <div>
            <span class="font-semibold">Date & Time: </span>
            <span>{{ formatDateTime(interview.date) }}</span>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="font-semibold">Status: </span>
            <span
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                interview.completed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800',
              ]"
            >
              {{ interview.completed ? "Completed" : "Uncompleted" }}
            </span>
          </div>
          
          <div v-if="interview.notes" class="mt-4">
            <span class="font-semibold block mb-2">Notes: </span>
            <div class="text-white/70 bg-black/10 p-4 rounded-lg">
              <TextDisplay :text="interview.notes" title="Interview Notes" />
            </div>
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
                    : positionInterviews.length > 0
                      ? 'bg-orange-100 text-orange-800'
                      : application
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{
                  position.rejected
                    ? "Rejected"
                    : positionInterviews.length > 0
                      ? "Interviewing"
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
    <EditInterviewModal
      :item="interviewWithPosition"
      :is-open="editInterviewModalOpen"
      @close="editInterviewModalOpen = false"
      @saved="handleInterviewModalSaved"
    />

    <DeleteConfirmationModal
      :is-open="deleteModalOpen"
      :company-name="deleteCompanyName"
      item-type="interview"
      @confirm="confirmDelete"
      @cancel="deleteModalOpen = false"
    />
  </div>
</template>

