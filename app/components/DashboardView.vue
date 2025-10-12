<script setup lang="ts">
import ApplicationCard from "./ApplicationCard.vue";
import InterviewCard from "./InterviewCard.vue";
import OfferCard from "./OfferCard.vue";
import AllItemsCard from "./AllItemsCard.vue";
import type { User, Application, Interview } from "~/assets/types/database";
import AddApplication from "./applicationManagement/AddApplication.vue";

interface Props {
  userItems: Application[];
}

const props = defineProps<Props>();

const addApplicationShown = ref<boolean | null>(false);
const editApplicationShown = ref<boolean | null>(false);

const addInterviewShown = ref<boolean | null>(false);
const editInterviewShown = ref<boolean | null>(false);

const applicationToEdit = ref<Application | null>(null);
const interviewToEdit = ref<Interview | null>(null);

// ---------------- view vs edit references -----------

const viewApplicationShown = ref<boolean | null>(false);
const viewInterviewShown = ref<boolean | null>(false);

const applicationToView = ref<Application | null>(null);
const interviewToView = ref<Interview | null>(null);

function getCardColor(status: string) {
  switch (status) {
    case "Application":
      return "bg-blue-200/50";
    case "Interview":
      return "bg-orange-200/50";
    case "Offer":
      return "bg-green-200/50";
    default:
      return "bg-gray-100/50";
  }
}

const ui_options = computed(() => {
  return "ui-button-compress transition-all duration-300 glass-ui cursor-pointer w-full p-4 text-left rounded-lg font-bold text-lg";
});

const applications = computed(
  () => props.userItems?.filter((item) => item.status == "Application") || []
);
const interviews = computed(
  () => props.userItems?.filter((item) => item.status == "Interview") || []
);
const offers = computed(
  () => props.userItems?.filter((item) => item.status == "Offer") || []
);

const selectedView = ref("applications");

const currentData = computed(() => {
  switch (selectedView.value) {
    case "applications":
      return applications.value;
    case "interviews":
      return interviews.value;
    case "offers":
      return offers.value;
    case "all":
      return props.userItems || [];
    default:
      return applications.value;
  }
});
</script>

<template>
  <div class="grid grid-cols-[20%_80%] h-[calc(100vh-rem)] gap-6 ml-4 mr-4">
    <div class="glass-card p-6 overflow-y-auto">
      <h2
        class="text-2xl font-bold text-white/80 mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
      >
        View Options
      </h2>

      <div class="space-y-3">
        <button
          @click="selectedView = 'applications'"
          :class="[ui_options]"
          :style="
            selectedView === 'applications'
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
            <span>Applications</span>
            <span
              class="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-sm"
            >
              {{ applications.length }}
            </span>
          </div>
        </button>

        <button
          @click="selectedView = 'interviews'"
          :class="[ui_options]"
          :style="
            selectedView === 'interviews'
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
            <span>Interviews</span>
            <span
              class="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-sm"
            >
              {{ interviews.length }}
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
                    'linear-gradient(120deg, rgba(16, 185, 129, 1), rgba(0, 0, 0, 0.2))',
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

        <button
          @click="selectedView = 'all'"
          :class="[ui_options]"
          :style="
            selectedView === 'all'
              ? {
                  backgroundImage:
                    'linear-gradient(120deg, rgba(139, 92, 246, 1), rgba(0, 0, 0, 0.2))',
                }
              : {
                  backgroundImage:
                    'linear-gradient(120deg, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0.2))',
                }
          "
        >
          <div class="flex items-center justify-between">
            <span>All</span>
            <span
              class="px-2 py-1 bg-purple-200 text-purple-800 rounded-full text-sm"
            >
              {{ userItems?.length || 0 }}
            </span>
          </div>
        </button>
      </div>

      <div class="mt-8 pt-6 border-t border-black/20">
        <h3 class="text-lg font-bold text-black/80 mb-4">Summary</h3>
        <div class="space-y-2 text-sm text-black/70">
          <div class="flex justify-between">
            <span>Total:</span>
            <span class="font-bold">{{ userItems?.length || 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span>Applications:</span>
            <span class="font-bold">{{ applications?.length || 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span>Interviews Scheduled:</span>
            <span class="font-bold">{{ interviews?.length || 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span>Offers Received:</span>
            <span class="font-bold">{{ offers?.length || 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex flex-col glass-card p-6 border-transparent overflow-hidden mr-6"
    >
      <div
        v-if="
          !(
            addApplicationShown ||
            editApplicationShown ||
            addInterviewShown ||
            editInterviewShown ||
            viewApplicationShown ||
            viewInterviewShown
          )
        "
      >
        <div
          class="hover:ml-10 transition-all duration-300 cursor-pointer glass flex justify-center items-center py-2 mb-4 flex-shrink-0"
        >
          <button
            class="cursor-pointer flex-1"
            @click="addApplicationShown = true"
          >
            + Add Item
          </button>
        </div>
        <div class="space-y-4 overflow-y-auto scrollbar-hide rounded-lg flex-1">
          <div
            v-if="currentData.length === 0"
            class="text-center text-black/60 py-8"
          >
            <p class="text-xl">No {{ selectedView }} found</p>
            <p class="text-sm mt-2">
              Start by adding your first {{ selectedView.slice(0, -1) }}
            </p>
          </div>

          <div v-else class="flex-1 space-y-3">
            <div
              v-for="item in currentData"
              :key="item.id"
              :class="[
                'hover:cursor-pointer glass-card-no-bg pl-4 pr-4 pt-2 pb-2 rounded-lg hover:ml-10 transition-all duration-300',
                getCardColor(item.status),
              ]"
            >
              <ApplicationCard
                v-if="selectedView === 'applications'"
                :item="item"
              />
              <InterviewCard
                v-else-if="selectedView === 'interviews'"
                :item="item"
              />
              <OfferCard v-else-if="selectedView === 'offers'" :item="item" />
              <AllItemsCard v-else-if="selectedView === 'all'" :item="item" />
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <AddApplication
          v-if="addApplicationShown"
          :stateManagementReference="{ addApplicationShown }"
        />
        <EditApplication
          v-if="editApplicationShown"
          :applicationId="applicationToEdit?.id"
          :stateManagementReference="{ editApplicationShown }"
        />
        <AddInterview
          v-if="addInterviewShown"
          :interviewId="interviewToEdit?.id"
          :stateManagementReference="{ addInterviewShown }"
        />
        <EditInterview
          v-if="editInterviewShown"
          :interviewId="interviewToEdit?.id"
          :stateManagementReference="{ editInterviewShown }"
        />
        <ViewApplication
          v-if="viewApplicationShown"
          :applicationId="applicationToView?.id"
          :stateManagementReference="{ viewApplicationShown }"
        />
        <ViewInterview
          v-if="viewInterviewShown"
          :interviewId="interviewToView?.id"
          :stateManagementReference="{ viewInterviewShown }"
        />
      </div>
    </div>
  </div>
</template>
