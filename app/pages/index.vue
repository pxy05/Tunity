<script setup lang="ts">
import useContext from "~/components/context/tempcontext";

const { user, userItems } = useContext();

// Home page component
definePageMeta({
  layout: "default",
});

// Sample data for applications, interviews, and offers

const applications = userItems.filter((item) => item.status == "Application");
const interviews = userItems.filter((item) => item.status == "Interview");
const offers = userItems.filter((item) => item.status == "Offer");

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
  <div v-if="user" class="flex flex-row gap-6 ml-4 mr-4 mt-4">
    <div class="glass-card w-[20%] h-full p-6">
      <h2
        class="text-2xl font-bold text-black/80 mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
      >
        View Options
      </h2>

      <!-- Selection buttons -->
      <div class="space-y-3">
        <button
          @click="selectedView = 'applications'"
          :class="[
            'cursor-pointer w-full p-4 text-left rounded-lg transition-all duration-300 font-bold text-lg',
            selectedView === 'applications'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white/50 text-black/80 hover:bg-blue-100 hover-expand-card',
          ]"
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
          :class="[
            'cursor-pointer w-full p-4 text-left rounded-lg transition-all duration-300 font-bold text-lg',
            selectedView === 'interviews'
              ? 'bg-orange-500 text-white shadow-lg'
              : 'bg-white/50 text-black/80 hover:bg-orange-100 hover-expand-card',
          ]"
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
          :class="[
            'cursor-pointer w-full p-4 text-left rounded-lg transition-all duration-300 font-bold text-lg',
            selectedView === 'offers'
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-white/50 text-black/80 hover:bg-green-100 hover-expand-card',
          ]"
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
          :class="[
            'cursor-pointer w-full p-4 text-left rounded-lg transition-all duration-300 font-bold text-lg',
            selectedView === 'all'
              ? 'bg-orange-500 text-white shadow-lg'
              : 'bg-white/50 text-black/80 hover:bg-orange-100 hover-expand-card',
          ]"
        >
          <div class="flex items-center justify-between">
            <span>All</span>
            <span
              class="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-sm"
            >
              {{ userItems.length }}
            </span>
          </div>
        </button>
      </div>

      <!-- Summary stats -->
      <div class="mt-8 pt-6 border-t border-black/20">
        <h3 class="text-lg font-bold text-black/80 mb-4">Summary</h3>
        <div class="space-y-2 text-sm text-black/70">
          <div class="flex justify-between">
            <span>Total:</span>
            <span class="font-bold">{{ userItems.length }}</span>
          </div>
          <div class="flex justify-between">
            <span>Total Applications:</span>
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
      class="flex-col glass-card w-[80%] max-h-[85vh] p-6 border-transparent mb-4"
    >
      <div
        class="cursor-pointer glass-card hover-expand-card flex flex-1 items-center mb-4 h-[10%] pl-4"
      >
        <button class="cursor-pointer flex-1">+ Add Item</button>
      </div>
      <!-- Data display based on selection -->
      <div
        class="space-y-4 flex-9 overflow-y-auto scrollbar-hide max-h-[88%] rounded-lg"
      >
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
            class="hover:cursor-pointer glass-card pl-4 pr-4 pt-2 pb-2 rounded-lg hover-expand-card"
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
      class="font-michroma glass w-[80vw] h-[86vh] rounded-2xl flex flex-col items-center -mb-[10%]"
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
