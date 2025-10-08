<script setup lang="ts">
import useContext from "~/context/tempcontext";

const { userItems } = useContext();

function getCardColor(status: string) {
  const prefix =
    "hover:cursor-pointer glass-card-no-bg pl-4 pr-4 pt-2 pb-2 rounded-lg hover-expand-card";
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
// Home page component
definePageMeta({
  layout: "default",
});

// Sample data for applications, interviews, and offers

const applications = userItems!.filter((item) => item.status == "Application");
const interviews = userItems!.filter((item) => item.status == "Interview");
const offers = userItems!.filter((item) => item.status == "Offer");

// Selection state
const selectedView = ref("applications");

// Computed property to get current data based on selection
const currentData = computed(() => {
  switch (selectedView.value) {
    case "applications":
      return applications;
    case "interviews":
      return interviews;
    case "offers":
      return offers;
    case "all":
      return userItems;
    default:
      return applications;
  }
});

// Method to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<template>
  <div
    v-if="user"
    class="grid grid-cols-[20%_80%] h-[calc(100vh-6rem)] gap-6 ml-4 mr-4"
  >
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
              {{ userItems.length }}
            </span>
          </div>
        </button>
      </div>

      <div class="mt-8 pt-6 border-t border-black/20">
        <h3 class="text-lg font-bold text-black/80 mb-4">Summary</h3>
        <div class="space-y-2 text-sm text-black/70">
          <div class="flex justify-between">
            <span>Total:</span>
            <span class="font-bold">{{ userItems.length }}</span>
          </div>
          <div class="flex justify-between">
            <span>Applications:</span>
            <span class="font-bold">{{ applications.length }}</span>
          </div>
          <div class="flex justify-between">
            <span>Interviews Scheduled:</span>
            <span class="font-bold">{{ interviews.length }}</span>
          </div>
          <div class="flex justify-between">
            <span>Offers Received:</span>
            <span class="font-bold">{{ offers.length }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex flex-col glass-card p-6 border-transparent overflow-hidden mr-6"
    >
      <div
        class="hover:ml-10 transition-all duration-300 cursor-pointer glass flex justify-center items-center py-2 mb-4 flex-shrink-0"
      >
        <button class="cursor-pointer flex-1">+ Add Item</button>
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
            <!-- Applications display -->
            <div v-if="selectedView === 'applications'">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-black/80">{{ item.name }}</h3>
                <span
                  class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {{ item.status }}
                </span>
              </div>
              <p class="text-lg text-black/70 mb-2">{{ item.company }}</p>
              <div class="flex justify-between text-sm text-black/60">
                <span>{{ item.location }}</span>
                <span>{{ item.salary }}</span>
              </div>
              <p class="text-sm text-black/50 mt-2">
                Applied: {{ formatDate(item.date) }}
              </p>
            </div>

            <!-- Interviews display -->
            <div v-else-if="selectedView === 'interviews'">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-black/80">{{ item.name }}</h3>
                <span
                  class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                >
                  {{ item.status }}
                </span>
              </div>
              <p class="text-lg text-black/70 mb-2">{{ item.company }}</p>
              <div class="flex justify-between text-sm text-black/60">
                <span>{{ item.type }}</span>
                <span>{{ item.time }}</span>
              </div>
              <p class="text-sm text-black/50 mt-2">
                Date: {{ formatDate(item.date) }}
              </p>
            </div>

            <!-- Offers display -->
            <div v-else-if="selectedView === 'offers'">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-black/80">{{ item.name }}</h3>
                <span
                  class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {{ item.status }}
                </span>
              </div>
              <p class="text-lg text-black/70 mb-2">{{ item.company }}</p>
              <div class="flex justify-between text-sm text-black/60">
                <span>Salary: {{ item.salary }}</span>
                <span>Deadline: {{ formatDate(item.deadline) }}</span>
              </div>
              <p class="text-sm text-black/50 mt-2">
                Received: {{ formatDate(item.date) }}
              </p>
            </div>

            <!-- All items display -->
            <div v-else-if="selectedView === 'all'">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-black/80">{{ item.name }}</h3>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    item.status === 'Application'
                      ? 'bg-blue-100 text-blue-800'
                      : item.status === 'Interview'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800',
                  ]"
                >
                  {{ item.status }}
                </span>
              </div>
              <p class="text-lg text-black/70 mb-2">{{ item.company }}</p>
              <div class="flex justify-between text-sm text-black/60">
                <span>{{ item.location }}</span>
                <span>{{ item.salary }}</span>
              </div>
              <div class="flex justify-between text-sm text-black/50 mt-2">
                <span>{{ formatDate(item.date) }}</span>
                <span v-if="item.status === 'Interview' && item.time">{{
                  item.time
                }}</span>
                <span v-if="item.status === 'Offer' && item.deadline"
                  >Deadline: {{ formatDate(item.deadline) }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col items-center mt-4">
    <div
      class="font-michroma glass-card w-[80vw] h-[80vh] rounded-2xl flex flex-col items-center -mb-[10%]"
      style="background-size: 35px"
    >
      <h1 class="text-black/80 text-5xl font-bold mb-8 mt-4">
        Welcome to Tunity
      </h1>
      <p
        class="text-black/80 text-xl text-center max-w-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
      >
        Start tracking your application process here.
      </p>
      <div
        class="text-black/80 flex gap-4 w-full h-full text-center mt-4 mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
      >
        <router-link
          to="/account/login"
          class="glass-card font-bold text-3xl flex-1 ml-4 text-left p-4 hover-expand-card"
        >
          <p>
            Login<br />
            to start <br />
            searching <br />
            again. <br />
          </p>
        </router-link>

        <router-link
          to="/account/register"
          class="glass-card font-bold text-3xl flex-1 mr-4 text-left p-4 hover-expand-card"
        >
          <p>
            Register<br />
            and start<br />
            tracking your<br />
            applications. <br />
          </p>
        </router-link>
      </div>
    </div>
  </div>
</template>
