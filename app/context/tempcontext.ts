import type {
  PositionWithApplication,
  User,
} from "@/assets/types/database";
import useApi from "~/composables/useApi";

// const userItems = [
//   {
//     id: 1,
//     name: "Software Engineer",
//     company: "Tech Corp",
//     status: "Application",
//     date: "2025-01-15",
//     location: "San Francisco, CA",
//     salary: "$120,000",
//   },
//   {
//     id: 2,
//     name: "Frontend Developer",
//     company: "StartupXYZ",
//     status: "Application",
//     date: "2025-01-10",
//     location: "Remote",
//     salary: "$95,000",
//   },
//   {
//     id: 3,
//     name: "Full Stack Developer",
//     company: "BigTech Inc",
//     status: "Application",
//     date: "2025-01-20",
//     location: "New York, NY",
//     salary: "$110,000",
//   },
//   {
//     id: 4,
//     name: "Software Engineer",
//     company: "Tech Corp",
//     status: "Application",
//     date: "2025-01-15",
//     location: "San Francisco, CA",
//     salary: "$120,000",
//   },
//   {
//     id: 5,
//     name: "Frontend Developer",
//     company: "StartupXYZ",
//     status: "Application",
//     date: "2025-01-10",
//     location: "Remote",
//     salary: "$95,000",
//   },
//   {
//     id: 6,
//     name: "Full Stack Developer",
//     company: "BigTech Inc",
//     status: "Application",
//     date: "2025-01-20",
//     location: "New York, NY",
//     salary: "$110,000",
//   },
//   {
//     id: 7,
//     name: "Software Engineer",
//     company: "Tech Corp",
//     status: "Application",
//     date: "2025-01-15",
//     location: "San Francisco, CA",
//     salary: "$120,000",
//   },
//   {
//     id: 8,
//     name: "Frontend Developer",
//     company: "StartupXYZ",
//     status: "Application",
//     date: "2025-01-10",
//     location: "Remote",
//     salary: "$95,000",
//   },
//   {
//     id: 9,
//     name: "Full Stack Developer",
//     company: "BigTech Inc",
//     status: "Application",
//     date: "2025-01-20",
//     location: "New York, NY",
//     salary: "$110,000",
//   },
//   {
//     id: 10,
//     name: "Software Engineer",
//     company: "Tech Corp",
//     status: "Interview",
//     date: "2025-01-15",
//     location: "San Francisco, CA",
//     salary: "$120,000",
//     time: "2:00 PM",
//     type: "Technical Interview",
//   },
//   {
//     id: 11,
//     name: "Frontend Developer",
//     company: "StartupXYZ",
//     status: "Interview",
//     date: "2025-01-10",
//     location: "Remote",
//     salary: "$95,000",
//     time: "10:00 AM",
//     type: "Phone Interview",
//   },
//   {
//     id: 12,
//     name: "Full Stack Developer",
//     company: "BigTech Inc",
//     status: "Interview",
//     date: "2025-01-20",
//     location: "New York, NY",
//     salary: "$110,000",
//     time: "3:30 PM",
//     type: "On-site Interview",
//   },
//   {
//     id: 13,
//     name: "Software Engineer",
//     company: "Tech Corp",
//     status: "Offer",
//     date: "2025-01-25",
//     location: "San Francisco, CA",
//     salary: "$120,000",
//     deadline: "2025-02-01",
//   },
//   {
//     id: 14,
//     name: "Frontend Developer",
//     company: "StartupXYZ",
//     status: "Offer",
//     date: "2025-01-18",
//     location: "Remote",
//     salary: "$95,000",
//     deadline: "2025-01-28",
//   },
//   {
//     id: 15,
//     name: "Frontend Developer",
//     company: "StartupXYZ",
//     status: "Offer",
//     date: "2025-01-20",
//     location: "Remote",
//     salary: "$95,000",
//     deadline: "2025-01-30",
//   },
// ];

// const user = {
//   userId: 1,
//   userName: "Euclid",
//   userEmail: "johndoe@example.com",
//   userPassword: "password",
//   userRole: "admin",
//   userCreatedAt: "2025-01-01",
//   userUpdatedAt: "2025-01-01",
//   userStatus: "active",
//   userLastLogin: "2025-01-01",
// };

export default function useContext() {
  const supabaseUser = useSupabaseUser();
  const user = ref<User | null>(null);
  const userItems = ref<PositionWithApplication[] | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  // Compute status for a position based on application/assessment existence
  const computeStatus = (item: PositionWithApplication): string => {
    if (item.rejected) {
      return "Rejected";
    }
    if (item.assessments && item.assessments.length > 0) {
      return "Interviewing";
    }
    if (item.application) {
      return "Applied";
    }
    return "Saved";
  };

  const getApplicationById = async (id: string) => {
    const item = userItems.value?.find(
      (item) => item.application?.id === id || item.id === id
    );
    return item;
  };

  const loadUserData = async () => {
    if (!supabaseUser.value?.id) {
      loading.value = false;
      return;
    }

    try {
      loading.value = true;

      // Get user
      const userResult = await useApi.getUser();
      if (userResult.error) {
        error.value = userResult.error.error;
        loading.value = false;
        return;
      }
      user.value = userResult.data;

      // Get positions with applications
      const positionsResult = await useApi.getApplicationsWithPositions(
        supabaseUser.value.id
      );
      if (positionsResult.error) {
        error.value = positionsResult.error.error;
        loading.value = false;
        return;
      }
      userItems.value = positionsResult.data || [];

      error.value = null;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load data";
      console.error("Error loading user data:", e);
    } finally {
      loading.value = false;
    }
  };

  watch(
    supabaseUser,
    (newSupabaseUser) => {
      if (newSupabaseUser?.id) {
        loadUserData();
      } else {
        loading.value = false;
      }
    },
    { immediate: true }
  );

  return {
    user,
    userItems,
    loading,
    error,
    loadUserData,
    computeStatus,
  };
}
