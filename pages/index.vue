<script setup lang="ts">
// Home page component
definePageMeta({
  layout: 'default'
})

const user = true;

// Sample data for applications, interviews, and offers
const applications = [
  {
    id: 1,
    name: "Software Engineer",
    company: "Tech Corp",
    status: "Applied",
    date: "2025-01-15",
    location: "San Francisco, CA",
    salary: "$120,000"
  },
  {
    id: 2,
    name: "Frontend Developer",
    company: "StartupXYZ",
    status: "Under Review",
    date: "2025-01-10",
    location: "Remote",
    salary: "$95,000"
  },
  {
    id: 3,
    name: "Full Stack Developer",
    company: "BigTech Inc",
    status: "Applied",
    date: "2025-01-20",
    location: "New York, NY",
    salary: "$110,000"
  }
]

const interviews = [
  {
    id: 1,
    name: "Software Engineer",
    company: "Tech Corp",
    status: "Scheduled",
    date: "2025-01-25",
    time: "2:00 PM",
    type: "Technical Interview"
  },
  {
    id: 2,
    name: "Frontend Developer",
    company: "StartupXYZ",
    status: "Completed",
    date: "2025-01-18",
    time: "10:00 AM",
    type: "Phone Interview"
  }
]

const offers = [
  {
    id: 1,
    name: "Frontend Developer",
    company: "StartupXYZ",
    status: "Received",
    date: "2025-01-20",
    salary: "$95,000",
    deadline: "2025-01-30"
  }
]

// Selection state
const selectedView = ref('applications')

// Computed property to get current data based on selection
const currentData = computed(() => {
  switch (selectedView.value) {
    case 'applications':
      return applications
    case 'interviews':
      return interviews
    case 'offers':
      return offers
    default:
      return applications
  }
})

// Method to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

</script>

<template>
  <div v-if="user" class="font-michroma w-[80%] h-full rounded-2xl flex flex-row gap-6">
    <!-- Left side - Data display -->
    <div class="glass flex-1 p-6">
      <h1 class="text-black/80 text-4xl font-bold mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
        Welcome to Tunity
      </h1>
      
      <!-- Data display based on selection -->
      <div class="space-y-4">
        <div v-if="currentData.length === 0" class="text-center text-black/60 py-8">
          <p class="text-xl">No {{ selectedView }} found</p>
          <p class="text-sm mt-2">Start by adding your first {{ selectedView.slice(0, -1) }}</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="item in currentData" 
            :key="item.id"
            class="glass-card p-4 rounded-lg hover-expand-card transition-all duration-300"
          >
            <!-- Applications display -->
            <div v-if="selectedView === 'applications'">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-black/80">{{ item.name }}</h3>
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {{ item.status }}
                </span>
              </div>
              <p class="text-lg text-black/70 mb-2">{{ item.company }}</p>
              <div class="flex justify-between text-sm text-black/60">
                <span>{{ item.location }}</span>
                <span>{{ item.salary }}</span>
              </div>
              <p class="text-sm text-black/50 mt-2">Applied: {{ formatDate(item.date) }}</p>
            </div>
            
            <!-- Interviews display -->
            <div v-else-if="selectedView === 'interviews'">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-black/80">{{ item.name }}</h3>
                <span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  {{ item.status }}
                </span>
              </div>
              <p class="text-lg text-black/70 mb-2">{{ item.company }}</p>
              <div class="flex justify-between text-sm text-black/60">
                <span>{{ item.type }}</span>
                <span>{{ item.time }}</span>
              </div>
              <p class="text-sm text-black/50 mt-2">Date: {{ formatDate(item.date) }}</p>
            </div>
            
            <!-- Offers display -->
            <div v-else-if="selectedView === 'offers'">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-black/80">{{ item.name }}</h3>
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {{ item.status }}
                </span>
              </div>
              <p class="text-lg text-black/70 mb-2">{{ item.company }}</p>
              <div class="flex justify-between text-sm text-black/60">
                <span>Salary: {{ item.salary }}</span>
                <span>Deadline: {{ formatDate(item.deadline) }}</span>
              </div>
              <p class="text-sm text-black/50 mt-2">Received: {{ formatDate(item.date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Selection panel -->
    <div class="glass-card w-80 p-6">
      <h2 class="text-2xl font-bold text-black/80 mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
        View Options
      </h2>
      
      <!-- Selection buttons -->
      <div class="space-y-3">
        <button
          @click="selectedView = 'applications'"
          :class="[
            'w-full p-4 text-left rounded-lg transition-all duration-300 font-bold text-lg',
            selectedView === 'applications' 
              ? 'bg-blue-500 text-white shadow-lg' 
              : 'bg-white/50 text-black/80 hover:bg-blue-100 hover-expand-card'
          ]"
        >
          <div class="flex items-center justify-between">
            <span>Applications</span>
            <span class="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
              {{ applications.length }}
            </span>
          </div>
        </button>
        
        <button
          @click="selectedView = 'interviews'"
          :class="[
            'w-full p-4 text-left rounded-lg transition-all duration-300 font-bold text-lg',
            selectedView === 'interviews' 
              ? 'bg-orange-500 text-white shadow-lg' 
              : 'bg-white/50 text-black/80 hover:bg-orange-100 hover-expand-card'
          ]"
        >
          <div class="flex items-center justify-between">
            <span>Interviews</span>
            <span class="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-sm">
              {{ interviews.length }}
            </span>
          </div>
        </button>
        
        <button
          @click="selectedView = 'offers'"
          :class="[
            'w-full p-4 text-left rounded-lg transition-all duration-300 font-bold text-lg',
            selectedView === 'offers' 
              ? 'bg-green-500 text-white shadow-lg' 
              : 'bg-white/50 text-black/80 hover:bg-green-100 hover-expand-card'
          ]"
        >
          <div class="flex items-center justify-between">
            <span>Offers</span>
            <span class="px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm">
              {{ offers.length }}
            </span>
          </div>
        </button>
      </div>
      
      <!-- Summary stats -->
      <div class="mt-8 pt-6 border-t border-black/20">
        <h3 class="text-lg font-bold text-black/80 mb-4">Summary</h3>
        <div class="space-y-2 text-sm text-black/70">
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
  </div>

  <div v-else class="font-michroma glass w-[80%] h-full rounded-2xl flex flex-col items-center">
    <h1 class="text-black/80 text-5xl font-bold mb-8 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] mt-4">
      Welcome to Tunity
    </h1>
    <p class="text-black/80 text-xl text-center max-w-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
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
</template>
