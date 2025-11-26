<script setup lang="ts">
import PositionCard from "./PositionCard.vue";
import AssessmentCard from "./AssessmentCard.vue";
import OfferCard from "./OfferCard.vue";
import EditPositionModal from "./modals/EditPositionModal.vue";
import EditAssessmentModal from "./modals/EditAssessmentModal.vue";
import DeleteConfirmationModal from "./modals/DeleteConfirmationModal.vue";
import useContext from "~/context/tempcontext";
import useApi from "~/composables/useApi";
import type {
  PositionWithApplication,
  AssessmentWithPosition,
  OfferWithPosition,
} from "~/assets/types/database";

interface Props {
  userItems: PositionWithApplication[];
}

const props = defineProps<Props>();
const context = useContext();

const selectedView = ref<"positions" | "assessments" | "offers">("positions");
const showCompleted = ref(false);

// Modal states
const editPositionModalOpen = ref(false);
const editAssessmentModalOpen = ref(false);
const deleteModalOpen = ref(false);

// Selected items for edit/delete
const selectedPosition = ref<PositionWithApplication | null>(null);
const selectedAssessment = ref<AssessmentWithPosition | null>(null);
const selectedOffer = ref<OfferWithPosition | null>(null);
const deleteItemType = ref<"position" | "assessment" | "offer">("position");

const ui_options = computed(() => {
  return "ui-button-compress transition-all duration-300 glass-ui cursor-pointer w-full p-4 text-left rounded-lg font-bold text-lg";
});

// Helper function to check if assessment date is in the past
const isAssessmentDatePast = (dateString: string | undefined): boolean => {
  if (!dateString) return false;
  const assessmentDate = new Date(dateString);
  const now = new Date();
  // Set time to start of day for comparison
  assessmentDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return assessmentDate < now;
};

// Helper function to flatten assessments from all positions
const flattenAssessments = (): AssessmentWithPosition[] => {
  const allAssessments: AssessmentWithPosition[] = [];

  localUserItems.value?.forEach((position) => {
    if (position.assessments && position.assessments.length > 0) {
      position.assessments.forEach((assessment) => {
        allAssessments.push({
          assessment,
          position: {
            id: position.id,
            user_id: position.user_id,
            company_name: position.company_name,
            position_name: position.position_name,
            location: position.location,
            company_img: position.company_img,
            rejected: position.rejected,
            applied_deadline: position.applied_deadline,
            applied_date: position.applied_date,
            company_notes: position.company_notes,
            created_at: position.created_at,
            updated_at: position.updated_at,
          },
        });
      });
    }
  });

  return allAssessments;
};

// Helper function to flatten offers from all positions
const flattenOffers = (): OfferWithPosition[] => {
  const allOffers: OfferWithPosition[] = [];

  localUserItems.value?.forEach((position) => {
    if (position.offer) {
      allOffers.push({
        offer: position.offer,
        position: {
          id: position.id,
          user_id: position.user_id,
          company_name: position.company_name,
          position_name: position.position_name,
          location: position.location,
          company_img: position.company_img,
          rejected: position.rejected,
          applied_deadline: position.applied_deadline,
          applied_date: position.applied_date,
          company_notes: position.company_notes,
          created_at: position.created_at,
          updated_at: position.updated_at,
        },
      });
    }
  });

  return allOffers;
};

// Local state for optimistic updates
const localUserItems = ref<PositionWithApplication[]>([]);

// Sync local state with props
watch(
  () => props.userItems,
  (newItems) => {
    localUserItems.value = newItems || [];
  },
  { immediate: true, deep: true }
);

// Positions computed - return all positions
const positions = computed(() => {
  return localUserItems.value || [];
});

// Assessments computed - flatten and filter
const assessments = computed(() => {
  const allAssessments = flattenAssessments();

  // Filter based on completed status and date
  const filtered = allAssessments.filter((item) => {
    const assessment = item.assessment;

    // If showCompleted is off, hide completed assessments
    if (!showCompleted.value && assessment.completed === true) {
      return false;
    }

    // If showCompleted is off, hide past assessments
    if (!showCompleted.value && isAssessmentDatePast(assessment.date)) {
      return false;
    }

    return true;
  });

  // Sort by date (upcoming first, then by date descending)
  return filtered.sort((a, b) => {
    const dateA = a.assessment.date ? new Date(a.assessment.date).getTime() : 0;
    const dateB = b.assessment.date ? new Date(b.assessment.date).getTime() : 0;

    // Upcoming assessments first
    const now = Date.now();
    const aIsUpcoming = dateA > now;
    const bIsUpcoming = dateB > now;

    if (aIsUpcoming && !bIsUpcoming) return -1;
    if (!aIsUpcoming && bIsUpcoming) return 1;

    // Then sort by date (earliest first for upcoming, latest first for past)
    if (aIsUpcoming && bIsUpcoming) {
      return dateA - dateB; // Earliest upcoming first
    } else {
      return dateB - dateA; // Latest past first
    }
  });
});

// Offers computed - flatten
const offers = computed(() => {
  return flattenOffers();
});

// Handle edit position
const handleEditPosition = (position: PositionWithApplication) => {
  selectedPosition.value = position;
  editPositionModalOpen.value = true;
};

// Handle edit assessment
const handleEditAssessment = (item: AssessmentWithPosition) => {
  selectedAssessment.value = item;
  editAssessmentModalOpen.value = true;
};

// Handle edit offer
const handleEditOffer = (item: OfferWithPosition) => {
  selectedOffer.value = item;
  // Offers don't have edit modal yet, navigate to detail page
  if (item.offer.id) {
    navigateTo(`/offer/${item.offer.id}`);
  }
};

// Handle delete position
const handleDeletePosition = (position: PositionWithApplication) => {
  selectedPosition.value = position;
  deleteItemType.value = "position";
  deleteModalOpen.value = true;
};

// Handle delete assessment
const handleDeleteAssessment = (item: AssessmentWithPosition) => {
  selectedAssessment.value = item;
  deleteItemType.value = "assessment";
  deleteModalOpen.value = true;
};

// Handle delete offer
const handleDeleteOffer = (item: OfferWithPosition) => {
  selectedOffer.value = item;
  deleteItemType.value = "offer";
  deleteModalOpen.value = true;
};

// Confirm delete
const confirmDelete = async () => {
  if (
    !selectedPosition.value &&
    !selectedAssessment.value &&
    !selectedOffer.value
  )
    return;

  const positionToDelete = selectedPosition.value;
  const assessmentToDelete = selectedAssessment.value;
  const offerToDelete = selectedOffer.value;
  const itemType = deleteItemType.value;

  // Optimistically remove item from local state immediately
  if (itemType === "position" && positionToDelete?.id) {
    localUserItems.value = localUserItems.value.filter(
      (item) => item.id !== positionToDelete.id
    );
  } else if (itemType === "assessment" && assessmentToDelete?.assessment.id) {
    // Remove assessment from the position's assessments array
    const positionId = assessmentToDelete.assessment.position_id;
    localUserItems.value = localUserItems.value.map((position) => {
      if (position.id === positionId) {
        return {
          ...position,
          assessments: position.assessments?.filter(
            (assessment) => assessment.id !== assessmentToDelete.assessment.id
          ),
        };
      }
      return position;
    });
  } else if (itemType === "offer" && offerToDelete?.offer.id) {
    // Remove offer from the position
    const positionId = offerToDelete.offer.position_id;
    localUserItems.value = localUserItems.value.map((position) => {
      if (position.id === positionId) {
        return {
          ...position,
          offer: undefined,
        };
      }
      return position;
    });
  }

  // Close modal immediately for better UX
  deleteModalOpen.value = false;
  selectedPosition.value = null;
  selectedAssessment.value = null;
  selectedOffer.value = null;

  try {
    if (itemType === "position" && positionToDelete?.id) {
      const result = await useApi.deletePosition(positionToDelete.id);
      if (result.error) {
        console.error("Error deleting position:", result.error);
        alert(`Failed to delete position: ${result.error.error}`);
        // Reload data to restore state if deletion failed
        await context.loadUserData();
        return;
      }
    } else if (itemType === "assessment" && assessmentToDelete?.assessment.id) {
      const result = await useApi.deleteAssessment(
        assessmentToDelete.assessment.id
      );
      if (result.error) {
        console.error("Error deleting assessment:", result.error);
        alert(`Failed to delete assessment: ${result.error.error}`);
        // Reload data to restore state if deletion failed
        await context.loadUserData();
        return;
      }
    } else if (itemType === "offer" && offerToDelete?.offer.id) {
      const result = await useApi.deleteOffer(offerToDelete.offer.id);
      if (result.error) {
        console.error("Error deleting offer:", result.error);
        alert(`Failed to delete offer: ${result.error.error}`);
        // Reload data to restore state if deletion failed
        await context.loadUserData();
        return;
      }
    }

    // Refresh data after successful deletion to sync with server
    await context.loadUserData();
  } catch (e) {
    console.error("Error deleting:", e);
    alert("An error occurred while deleting");
    // Reload data to restore state if deletion failed
    await context.loadUserData();
  }
};

// Get company name for delete confirmation
const deleteCompanyName = computed(() => {
  if (deleteItemType.value === "position" && selectedPosition.value) {
    return selectedPosition.value.company_name || "Unknown Company";
  } else if (
    deleteItemType.value === "assessment" &&
    selectedAssessment.value
  ) {
    return selectedAssessment.value.position.company_name || "Unknown Company";
  } else if (deleteItemType.value === "offer" && selectedOffer.value) {
    return selectedOffer.value.position.company_name || "Unknown Company";
  }
  return "";
});

// Handle modal close
const handlePositionModalSaved = () => {
  editPositionModalOpen.value = false;
  selectedPosition.value = null;
};

const handleAssessmentModalSaved = () => {
  editAssessmentModalOpen.value = false;
  selectedAssessment.value = null;
};

// Context-aware button for adding items
const addButtonText = computed(() => {
  if (selectedView.value === "positions") return "+ Add Position";
  if (selectedView.value === "assessments") return "+ Add Assessment";
  return "+ Add Offer";
});

const addButtonRoute = computed(() => {
  if (selectedView.value === "positions") return "/create-application";
  if (selectedView.value === "assessments") return "/create-assessment";
  return "/create-offer";
});
</script>

<template>
  <div class="grid grid-cols-[20%_80%] h-[86vh] gap-6 ml-4 mr-4 mt-6">
    <div class="glass-card p-6 overflow-y-auto max-h-[85vh]">
      <h2
        class="text-2xl font-bold text-white/80 mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
      >
        View Options
      </h2>

      <div class="space-y-3">
        <button
          @click="selectedView = 'positions'"
          :class="[ui_options]"
          :style="
            selectedView === 'positions'
              ? {
                  backgroundImage:
                    'linear-gradient(120deg, rgba(59, 130, 246, 1), rgba(0, 0, 0, 0.2))',
                }
              : {
                  backgroundImage:
                    'linear-gradient(120deg, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0.2))',
                }
          "
        >
          <div class="flex items-center justify-between">
            <span>Positions</span>
            <span
              class="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-sm"
            >
              {{ positions.length }}
            </span>
          </div>
        </button>

        <button
          @click="selectedView = 'assessments'"
          :class="[ui_options]"
          :style="
            selectedView === 'assessments'
              ? {
                  backgroundImage:
                    'linear-gradient(120deg, rgba(244, 99, 30, 1), rgba(0, 0, 0, 0.2))',
                }
              : {
                  backgroundImage:
                    'linear-gradient(120deg, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0.2))',
                }
          "
        >
          <div class="flex items-center justify-between">
            <span>Assessments</span>
            <span
              class="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-sm"
            >
              {{ assessments.length }}
            </span>
          </div>
        </button>

        <button
          @click="selectedView = 'offers'"
          :class="[ui_options]"
          :style="
            selectedView === 'offers'
              ? {
                  backgroundImage:
                    'linear-gradient(120deg, rgba(34, 197, 94, 1), rgba(0, 0, 0, 0.2))',
                }
              : {
                  backgroundImage:
                    'linear-gradient(120deg, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0.2))',
                }
          "
        >
          <div class="flex items-center justify-between">
            <span>Offers</span>
            <span
              class="px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm"
            >
              {{ offers.length }}
            </span>
          </div>
        </button>
      </div>

      <div class="mt-8 pt-6 border-t border-black/20">
        <h3 class="text-lg font-bold text-white/80 mb-4">Summary</h3>
        <div class="space-y-2 text-sm text-white/70">
          <div class="flex justify-between">
            <span>Positions:</span>
            <span class="font-bold">{{ positions.length }}</span>
          </div>
          <div class="flex justify-between">
            <span>Assessments:</span>
            <span class="font-bold">{{ assessments.length }}</span>
          </div>
          <div class="flex justify-between">
            <span>Offers:</span>
            <span class="font-bold">{{ offers.length }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex flex-col glass-card p-6 border-transparent mr-6 max-h-[85vh]"
    >
      <div
        v-if="
          !editPositionModalOpen && !editAssessmentModalOpen && !deleteModalOpen
        "
        class="flex flex-col h-full max-h-[85vh]"
      >
        <!-- Show Completed Toggle (only for Assessments view) -->
        <div
          v-if="selectedView === 'assessments'"
          class="flex items-center justify-between mb-4 pb-4 border-b border-black/20 flex-shrink-0"
        >
          <span class="text-white/80 font-semibold"
            >Show Completed Assessments</span
          >
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="showCompleted"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600/80"
            ></div>
          </label>
        </div>

        <div
          class="hover:ml-10 transition-all duration-300 cursor-pointer glass flex justify-center items-center py-2 mb-4 flex-shrink-0"
        >
          <button
            class="cursor-pointer flex-1"
            @click="navigateTo(addButtonRoute)"
          >
            {{ addButtonText }}
          </button>
        </div>
        <div
          class="flex-1 min-h-0 max-h-[85vh] overflow-y-auto overflow-x-hidden"
        >
          <div
            v-if="
              (selectedView === 'positions' && positions.length === 0) ||
              (selectedView === 'assessments' && assessments.length === 0) ||
              (selectedView === 'offers' && offers.length === 0)
            "
            class="text-center text-black/60 py-8"
          >
            <p class="text-xl">No {{ selectedView }} found</p>
            <p class="text-sm mt-2">
              Start by adding your first
              {{
                selectedView === "positions"
                  ? "position"
                  : selectedView === "assessments"
                    ? "assessment"
                    : "offer"
              }}
            </p>
          </div>

          <div v-else class="space-y-3">
            <!-- Positions View -->
            <div
              v-if="selectedView === 'positions'"
              v-for="item in positions"
              :key="item.id"
              class="glass-card bg-white/20 pl-4 pr-4 pt-2 pb-2 rounded-lg hover:ml-10 transition-all duration-300"
            >
              <PositionCard
                :item="item"
                @edit="handleEditPosition"
                @delete="handleDeletePosition"
              />
            </div>

            <!-- Assessments View -->
            <div
              v-if="selectedView === 'assessments'"
              v-for="(item, index) in assessments"
              :key="`${item.assessment.id}-${index}`"
              class="glass-card bg-white/20 pl-4 pr-4 pt-2 pb-2 rounded-lg hover:ml-10 transition-all duration-300"
            >
              <AssessmentCard
                :item="item"
                @edit="handleEditAssessment"
                @delete="handleDeleteAssessment"
              />
            </div>

            <!-- Offers View -->
            <div
              v-if="selectedView === 'offers'"
              v-for="(item, index) in offers"
              :key="`${item.offer.id}-${index}`"
              class="glass-card bg-white/20 pl-4 pr-4 pt-2 pb-2 rounded-lg hover:ml-10 transition-all duration-300"
            >
              <OfferCard
                :item="item"
                @edit="handleEditOffer"
                @delete="handleDeleteOffer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <EditPositionModal
      :position="selectedPosition"
      :is-open="editPositionModalOpen"
      @close="editPositionModalOpen = false"
      @saved="handlePositionModalSaved"
    />

    <EditAssessmentModal
      :item="selectedAssessment"
      :is-open="editAssessmentModalOpen"
      @close="editAssessmentModalOpen = false"
      @saved="handleAssessmentModalSaved"
    />

    <DeleteConfirmationModal
      :is-open="deleteModalOpen"
      :company-name="deleteCompanyName"
      :item-type="deleteItemType"
      @confirm="confirmDelete"
      @cancel="
        deleteModalOpen = false;
        selectedPosition = null;
        selectedAssessment = null;
        selectedOffer = null;
      "
    />
  </div>
</template>
