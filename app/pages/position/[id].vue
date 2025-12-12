<script setup lang="ts">
import useApi from "~/composables/useApi";
import useDateFormat from "~/composables/useDateFormat";
import { getAssessmentTypeLabel } from "~/utils/assessmentTypes";
import EditPositionModal from "~/components/modals/EditPositionModal.vue";
import EditApplicationModal from "~/components/modals/EditApplicationModal.vue";
import DeleteConfirmationModal from "~/components/modals/DeleteConfirmationModal.vue";
import TextDisplay from "~/components/TextDisplay.vue";
import PageLoader from "~/components/UI/PageLoader.vue";
import PageError from "~/components/UI/PageError.vue";
import ActionButtons from "~/components/UI/ActionButtons.vue";
import backDashboard from "~/components/UI/backDashboard.vue";
import type { PositionWithApplication, Assessment, Offer, Application } from "~/assets/types/database";

definePageMeta({
  layout: "default",
});

const route = useRoute();
const positionId = route.params.id as string;

const position = ref<PositionWithApplication | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Modal states
const editPositionModalOpen = ref(false);
const editApplicationModalOpen = ref(false);
const deleteModalOpen = ref(false);

interface TimelineEvent {
  type: "application" | "assessment" | "offer";
  date: string;
  title: string;
  description?: string;
  assessment?: Assessment;
  offer?: Offer;
}

const { formatDate, formatDateTime } = useDateFormat();

const timeline = computed((): TimelineEvent[] => {
  if (!position.value) return [];
  
  const events: TimelineEvent[] = [];
  
  // Add application date if exists
  if (position.value.applied_date) {
    events.push({
      type: "application",
      date: position.value.applied_date,
      title: "Application Submitted",
      description: `Applied for ${position.value.position_name} at ${position.value.company_name}`,
    });
  }
  
  // Add assessments
  if (position.value.assessments && position.value.assessments.length > 0) {
    position.value.assessments.forEach((assessment) => {
      if (assessment.date) {
        const round = assessment.round || "N/A";
        const typeLabel = getAssessmentTypeLabel(assessment.assessment_type);
        events.push({
          type: "assessment",
          date: assessment.date,
          title: `Round ${round} - ${typeLabel}`,
          description: assessment.pre_notes || assessment.post_notes || undefined,
          assessment: assessment,
        });
      }
    });
  }
  
  // Add offer if exists
  if (position.value.offer && position.value.offer.received_at) {
    events.push({
      type: "offer",
      date: position.value.offer.received_at,
      title: "Offer Received",
      description: `Received offer for ${position.value.position_name} at ${position.value.company_name}`,
      offer: position.value.offer,
    });
  }
  
  // Sort chronologically (newest first)
  return events.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
});

const loadPositionData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Fetch position
    const positionResult = await useApi.getPosition(positionId);
    if (positionResult.error) {
      error.value = positionResult.error.error;
      loading.value = false;
      return;
    }
    
    if (!positionResult.data) {
      error.value = "Position not found";
      loading.value = false;
      return;
    }
    
    // Fetch application, assessments, and offers in parallel
    const [applicationResult, assessmentsResult, offersResult] = await Promise.all([
      useApi.getApplications(),
      useApi.getAssessments(),
      useApi.getOffers(),
    ]);
    
    const application = applicationResult.data?.find(
      (app) => app.position_id === positionId
    );
    
    const assessments = assessmentsResult.data?.filter(
      (assessment) => assessment.position_id === positionId
    );
    
    const offer = offersResult.data?.find(
      (offer) => offer.position_id === positionId
    );
    
    position.value = {
      ...positionResult.data,
      application: application,
      assessments: assessments && assessments.length > 0 ? assessments : undefined,
      offer: offer,
    };
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to load position";
    console.error("Error loading position:", e);
  } finally {
    loading.value = false;
  }
};

const handleEdit = () => {
  editPositionModalOpen.value = true;
};

const handleDelete = () => {
  deleteModalOpen.value = true;
};

const handlePositionModalSaved = async () => {
  editPositionModalOpen.value = false;
  await loadPositionData();
};

const handleApplicationClick = () => {
  if (position.value?.application) {
    editApplicationModalOpen.value = true;
  }
};

const handleApplicationModalSaved = async () => {
  editApplicationModalOpen.value = false;
  await loadPositionData();
};

const handleToggleAssessmentCompleted = async (assessment: Assessment, event: Event) => {
  event.stopPropagation();
  
  if (!assessment.id) return;
  
  const newCompleted = !assessment.completed;
  
  // Optimistic update
  const originalCompleted = assessment.completed;
  assessment.completed = newCompleted;
  
  try {
    const assessmentData = {
      position_id: assessment.position_id || undefined,
      date: assessment.date ? new Date(assessment.date).toISOString() : undefined,
      round: assessment.round || undefined,
      assessment_type: assessment.assessment_type || undefined,
      pre_notes: assessment.pre_notes || undefined,
      post_notes: assessment.post_notes || undefined,
      completed: newCompleted,
    };
    
    const result = await useApi.updateAssessment(assessment.id, assessmentData);
    
    if (result.error) {
      // Revert on error
      assessment.completed = originalCompleted;
      console.error("Error updating assessment:", result.error);
      alert(`Failed to update assessment: ${result.error.error}`);
      return;
    }
    
    // Refresh data to sync with server
    await loadPositionData();
  } catch (e) {
    // Revert on error
    assessment.completed = originalCompleted;
    console.error("Error toggling assessment completed status:", e);
    alert("An error occurred while updating the assessment");
  }
};

const confirmDelete = async () => {
  if (!position.value?.id) return;

  const positionToDelete = position.value;
  const positionId = positionToDelete.id;

  if (!positionId) return;

  try {
    const result = await useApi.deletePosition(positionId);
    if (result.error) {
      console.error("Error deleting position:", result.error);
      alert(`Failed to delete position: ${result.error.error}`);
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
  loadPositionData();
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
    
    <div v-else-if="position" class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <backDashboard/>
      
      <!-- Position Details -->
      <div class="glass-card bg-white/20 p-6 rounded-lg mb-6">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-white/90 mb-2">
              {{ position.position_name || "Untitled Position" }}
            </h1>
            <p class="text-xl text-white/80 mb-4">
              {{ position.company_name || "Unknown Company" }}
            </p>
          </div>
          <ActionButtons @edit="handleEdit" @delete="handleDelete" />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
          <div>
            <span class="font-semibold">Location: </span>
            <span>{{ position.location || "Not specified" }}</span>
          </div>
          
          <div>
            <span class="font-semibold">Status: </span>
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                position.rejected
                  ? 'bg-red-100 text-red-800'
                  : position.offer
                    ? 'bg-green-100 text-green-800'
                    : position.assessments && position.assessments.length > 0
                      ? 'bg-orange-100 text-orange-800'
                      : position.application
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800',
              ]"
            >
              {{
                position.rejected
                  ? "Rejected"
                  : position.offer
                    ? "Offer"
                    : position.assessments && position.assessments.length > 0
                      ? "Interviewing"
                      : position.application
                        ? "Applied"
                        : "Saved"
              }}
            </span>
          </div>
          
          <div v-if="!position.application && position.id" class="md:col-span-2">
            <button
              @click="navigateTo(`/add-application/${position.id}`)"
              class="px-4 py-2 bg-blue-500/20 text-white rounded hover:bg-blue-500/30 border border-blue-400/40 transition-colors"
            >
              Add Application
            </button>
          </div>
          
          <div v-if="position.applied_date">
            <span class="font-semibold">Applied Date: </span>
            <span>{{ formatDate(position.applied_date) }}</span>
          </div>
          
          <div v-if="position.applied_deadline">
            <span class="font-semibold">Application Deadline: </span>
            <span>{{ formatDate(position.applied_deadline) }}</span>
          </div>
          
          <div v-if="position.company_notes" class="md:col-span-2">
            <span class="font-semibold">Company Notes: </span>
            <div class="mt-1 text-white/70">
              <TextDisplay :text="position.company_notes" title="Company Notes" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Timeline Section -->
      <div class="glass-card bg-white/20 p-6 rounded-lg">
        <h2 class="text-2xl font-bold text-white/90 mb-6">Timeline</h2>
        
        <div v-if="timeline.length === 0" class="text-white/70 italic">
          No timeline events yet
        </div>
        
        <div v-else class="relative">
          <!-- Timeline line -->
          <div
            class="absolute left-4 top-0 bottom-0 w-0.5 bg-white/30"
            style="transform: translateX(-50%);"
          ></div>
          
          <!-- Timeline events -->
          <div class="space-y-6">
            <div
              v-for="(event, index) in timeline"
              :key="index"
              class="relative flex items-start gap-4"
            >
              <!-- Timeline dot -->
              <div
                :class="[
                  'relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  event.type === 'application'
                    ? 'bg-blue-500'
                    : event.type === 'offer'
                      ? 'bg-green-500'
                      : 'bg-orange-500',
                ]"
              >
                <div class="w-3 h-3 bg-white rounded-full"></div>
              </div>
              
              <!-- Event content -->
              <div 
                class="flex-1 glass-card bg-white/80 p-4 rounded-lg"
                :class="(event.assessment || event.type === 'application' || event.offer) ? 'cursor-pointer hover:bg-white/90 transition-colors' : ''"
                @click="event.assessment?.id ? navigateTo(`/assessment/${event.assessment.id}`) : (event.type === 'application' ? handleApplicationClick() : (event.offer?.id ? navigateTo(`/offer/${event.offer.id}`) : null))"
              >
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-semibold text-white/90">
                    {{ event.title }}
                  </h3>
                  <span class="text-sm text-white/70">
                    {{ formatDateTime(event.date) }}
                  </span>
                </div>
                
                <p v-if="event.description" class="text-white/70 mb-2">
                  {{ event.description }}
                </p>
                
                <div
                  v-if="event.assessment"
                  class="flex items-center gap-2 text-sm"
                  @click.stop
                >
                  <label class="flex items-center gap-2 cursor-pointer">
                    <span v-if="!event.assessment.completed" class="text-white/90">Completed?</span>
                    <input
                      type="checkbox"
                      :checked="event.assessment.completed || false"
                      @change="handleToggleAssessmentCompleted(event.assessment, $event)"
                      class="w-4 h-4 cursor-pointer"
                    />
                    <span v-if="event.assessment.completed" class="text-green-400">Completed.</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <EditPositionModal
      :position="position"
      :is-open="editPositionModalOpen"
      @close="editPositionModalOpen = false"
      @saved="handlePositionModalSaved"
    />

    <EditApplicationModal
      :application="position?.application || null"
      :position="position"
      :is-open="editApplicationModalOpen"
      @close="editApplicationModalOpen = false"
      @saved="handleApplicationModalSaved"
    />

    <DeleteConfirmationModal
      :is-open="deleteModalOpen"
      :company-name="deleteCompanyName"
      item-type="position"
      @confirm="confirmDelete"
      @cancel="deleteModalOpen = false"
    />
  </div>
</template>


