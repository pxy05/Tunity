import type {
  Application,
  ApplicationInput,
  ApiError,
  Assessment,
  AssessmentInput,
  Interview,
  InterviewInput,
  Offer,
  OfferInput,
  Position,
  PositionInput,
  PositionWithApplication,
  User,
} from "~/assets/types/database";

function getApiUrl() {
  const config = useRuntimeConfig();
  return config.public.tunityApiUrl;
}

interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

async function handleApiResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  let data;
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error("[API] Failed to parse API response:", e);
    return {
      data: null,
      error: {
        error: "Invalid response from server",
        code: "DATABASE_ERROR",
      },
    };
  }

  if (!response.ok) {
    // Handle error responses
    const error: ApiError = {
      error: data?.error || `HTTP ${response.status}: ${response.statusText}`,
      code:
        response.status === 404 ? "NOT_FOUND" : data?.code || "DATABASE_ERROR",
    };
    console.log("[API] Error response:", {
      status: response.status,
      code: error.code,
      message: error.error,
    });
    return { data: null, error };
  }

  // Handle successful responses (200, 201, etc.)
  console.log("[API] Success response:", { hasData: !!data });
  return { data: data as T, error: null };
}

// ==================== USER FUNCTIONS ====================

async function getUser(): Promise<ApiResponse<User>> {
  const supabaseUser = useSupabaseUser();
  if (!supabaseUser.value?.id) {
    console.log("[API] getUser: No Supabase user ID");
    return {
      data: null,
      error: { error: "User not authenticated", code: "INVALID_INPUT" },
    };
  }

  const apiURL = getApiUrl();
  const url = `${apiURL}/users/${supabaseUser.value.id}`;
  console.log("[API] getUser: Fetching from:", url);

  const response = await fetch(url);
  console.log("[API] getUser: Response status:", response.status);

  return handleApiResponse<User>(response);
}

async function createUser(
  username: string,
  email: string,
  firstname: string | null,
  lastname: string | null
): Promise<ApiResponse<User>> {
  const apiURL = getApiUrl();

  if (!username || username.trim() === "") {
    return {
      data: null,
      error: { error: "Username is required", code: "VALIDATION_ERROR" },
    };
  }

  if (!email || email.trim() === "") {
    return {
      data: null,
      error: { error: "Email is required", code: "VALIDATION_ERROR" },
    };
  }

  // Ensure first_name and last_name are not null/empty (API spec requires minLength: 1)
  const firstName =
    firstname && firstname.trim() !== "" ? firstname.trim() : "";
  const lastName = lastname && lastname.trim() !== "" ? lastname.trim() : "";

  if (!firstName || firstName.length === 0) {
    return {
      data: null,
      error: { error: "First name is required", code: "VALIDATION_ERROR" },
    };
  }

  if (!lastName || lastName.length === 0) {
    return {
      data: null,
      error: { error: "Last name is required", code: "VALIDATION_ERROR" },
    };
  }

  const response = await fetch(`${apiURL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.trim(),
      email: email.trim(),
      first_name: firstName,
      last_name: lastName,
    }),
  });

  return handleApiResponse<User>(response);
}

// ==================== POSITION FUNCTIONS ====================

async function getPositions(
  user_id?: string
): Promise<ApiResponse<Position[]>> {
  const apiURL = getApiUrl();
  const response = await fetch(`${apiURL}/positions`);

  const result = await handleApiResponse<Position[]>(response);

  if (result.data && user_id) {
    // Filter by user_id client-side
    result.data = result.data.filter((p) => p.user_id === user_id);
  }

  return result;
}

async function getPosition(id: string): Promise<ApiResponse<Position>> {
  const apiURL = getApiUrl();
  const response = await fetch(`${apiURL}/positions/${id}`);

  return handleApiResponse<Position>(response);
}

async function createPosition(
  position: PositionInput
): Promise<ApiResponse<Position>> {
  const apiURL = getApiUrl();

  if (!position.user_id) {
    return {
      data: null,
      error: { error: "User ID is required", code: "VALIDATION_ERROR" },
    };
  }

  const response = await fetch(`${apiURL}/positions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(position),
  });

  return handleApiResponse<Position>(response);
}

async function updatePosition(
  id: string,
  position: PositionInput
): Promise<ApiResponse<Position>> {
  const apiURL = getApiUrl();

  const response = await fetch(`${apiURL}/positions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(position),
  });

  return handleApiResponse<Position>(response);
}

async function deletePosition(id: string): Promise<ApiResponse<void>> {
  const apiURL = getApiUrl();

  const response = await fetch(`${apiURL}/positions/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    return {
      data: null,
      error: {
        error: data.error || "Failed to delete position",
        code: data.code || "DATABASE_ERROR",
      },
    };
  }

  return { data: null, error: null };
}

// ==================== APPLICATION FUNCTIONS ====================

async function getApplications(
  user_id?: string
): Promise<ApiResponse<Application[]>> {
  const apiURL = getApiUrl();
  const response = await fetch(`${apiURL}/applications`);

  const result = await handleApiResponse<Application[]>(response);

  if (result.data && user_id) {
    // Filter by user_id client-side
    result.data = result.data.filter((a) => a.user_id === user_id);
  }

  return result;
}

async function getApplication(id: string): Promise<ApiResponse<Application>> {
  const apiURL = getApiUrl();
  const response = await fetch(`${apiURL}/applications/${id}`);

  return handleApiResponse<Application>(response);
}

async function createApplication(
  application: ApplicationInput
): Promise<ApiResponse<Application>> {
  const apiURL = getApiUrl();

  if (!application.user_id) {
    return {
      data: null,
      error: { error: "User ID is required", code: "VALIDATION_ERROR" },
    };
  }

  if (!application.position_id) {
    return {
      data: null,
      error: { error: "Position ID is required", code: "VALIDATION_ERROR" },
    };
  }

  const response = await fetch(`${apiURL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  });

  return handleApiResponse<Application>(response);
}

async function updateApplication(
  id: string,
  application: ApplicationInput
): Promise<ApiResponse<Application>> {
  const apiURL = getApiUrl();

  const response = await fetch(`${apiURL}/applications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  });

  return handleApiResponse<Application>(response);
}

async function deleteApplication(id: string): Promise<ApiResponse<void>> {
  const apiURL = getApiUrl();

  const response = await fetch(`${apiURL}/applications/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    return {
      data: null,
      error: {
        error: data.error || "Failed to delete application",
        code: data.code || "DATABASE_ERROR",
      },
    };
  }

  return { data: null, error: null };
}

// ==================== INTERVIEW FUNCTIONS ====================

async function getInterviews(
  position_id?: string
): Promise<ApiResponse<Interview[]>> {
  const apiURL = getApiUrl();
  const response = await fetch(`${apiURL}/interviews`);

  const result = await handleApiResponse<Interview[]>(response);

  if (result.data && position_id) {
    // Filter by position_id client-side
    result.data = result.data.filter((i) => i.position_id === position_id);
  }

  return result;
}

async function getInterview(id: string): Promise<ApiResponse<Interview>> {
  const apiURL = getApiUrl();
  const response = await fetch(`${apiURL}/interviews/${id}`);

  return handleApiResponse<Interview>(response);
}

async function createInterview(
  interview: InterviewInput
): Promise<ApiResponse<Interview>> {
  const apiURL = getApiUrl();

  const response = await fetch(`${apiURL}/interviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(interview),
  });

  return handleApiResponse<Interview>(response);
}

async function updateInterview(
  id: string,
  interview: InterviewInput
): Promise<ApiResponse<Interview>> {
  const apiURL = getApiUrl();

  const response = await fetch(`${apiURL}/interviews/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(interview),
  });

  return handleApiResponse<Interview>(response);
}

async function deleteInterview(id: string): Promise<ApiResponse<void>> {
  const apiURL = getApiUrl();

  const response = await fetch(`${apiURL}/interviews/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    return {
      data: null,
      error: {
        error: data.error || "Failed to delete interview",
        code: data.code || "DATABASE_ERROR",
      },
    };
  }

  return { data: null, error: null };
}

// ==================== ASSESSMENT FUNCTIONS ====================

async function getAssessments(
  position_id?: string
): Promise<ApiResponse<Assessment[]>> {
  const apiURL = getApiUrl();
  const response = await fetch(`${apiURL}/assessments`);

  const result = await handleApiResponse<Assessment[]>(response);

  if (result.data && position_id) {
    // Filter by position_id client-side
    result.data = result.data.filter((a) => a.position_id === position_id);
  }

  return result;
}

async function getAssessment(id: string): Promise<ApiResponse<Assessment>> {
  const apiURL = getApiUrl();
  const response = await fetch(`${apiURL}/assessments/${id}`);

  return handleApiResponse<Assessment>(response);
}

async function createAssessment(
  assessment: AssessmentInput
): Promise<ApiResponse<Assessment>> {
  const apiURL = getApiUrl();

  const response = await fetch(`${apiURL}/assessments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assessment),
  });

  return handleApiResponse<Assessment>(response);
}

async function updateAssessment(
  id: string,
  assessment: AssessmentInput
): Promise<ApiResponse<Assessment>> {
  const apiURL = getApiUrl();

  const response = await fetch(`${apiURL}/assessments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assessment),
  });

  return handleApiResponse<Assessment>(response);
}

async function deleteAssessment(id: string): Promise<ApiResponse<void>> {
  const apiURL = getApiUrl();

  const response = await fetch(`${apiURL}/assessments/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    return {
      data: null,
      error: {
        error: data.error || "Failed to delete assessment",
        code: data.code || "DATABASE_ERROR",
      },
    };
  }

  return { data: null, error: null };
}

// ==================== OFFER FUNCTIONS ====================

async function getOffers(
  user_id?: string,
  position_id?: string
): Promise<ApiResponse<Offer[]>> {
  const apiURL = getApiUrl();
  const response = await fetch(`${apiURL}/offers`);

  const result = await handleApiResponse<Offer[]>(response);

  if (result.data) {
    if (user_id) {
      result.data = result.data.filter((o) => o.user_id === user_id);
    }
    if (position_id) {
      result.data = result.data.filter((o) => o.position_id === position_id);
    }
  }

  return result;
}

async function getOffer(id: string): Promise<ApiResponse<Offer>> {
  const apiURL = getApiUrl();
  const response = await fetch(`${apiURL}/offers/${id}`);

  return handleApiResponse<Offer>(response);
}

async function createOffer(offer: OfferInput): Promise<ApiResponse<Offer>> {
  const apiURL = getApiUrl();

  if (!offer.user_id) {
    return {
      data: null,
      error: { error: "User ID is required", code: "VALIDATION_ERROR" },
    };
  }

  if (!offer.position_id) {
    return {
      data: null,
      error: { error: "Position ID is required", code: "VALIDATION_ERROR" },
    };
  }

  const response = await fetch(`${apiURL}/offers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(offer),
  });

  return handleApiResponse<Offer>(response);
}

async function updateOffer(
  id: string,
  offer: OfferInput
): Promise<ApiResponse<Offer>> {
  const apiURL = getApiUrl();

  const response = await fetch(`${apiURL}/offers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(offer),
  });

  return handleApiResponse<Offer>(response);
}

async function deleteOffer(id: string): Promise<ApiResponse<void>> {
  const apiURL = getApiUrl();

  const response = await fetch(`${apiURL}/offers/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    return {
      data: null,
      error: {
        error: data.error || "Failed to delete offer",
        code: data.code || "DATABASE_ERROR",
      },
    };
  }

  return { data: null, error: null };
}

// ==================== HELPER FUNCTIONS ====================

async function getApplicationsWithPositions(
  user_id: string
): Promise<ApiResponse<PositionWithApplication[]>> {
  // Fetch positions, applications, assessments, and offers in parallel
  const [positionsResult, applicationsResult, assessmentsResult, offersResult] =
    await Promise.all([
      getPositions(user_id),
      getApplications(user_id),
      getAssessments(),
      getOffers(user_id),
    ]);

  if (positionsResult.error) {
    return { data: null, error: positionsResult.error };
  }

  if (applicationsResult.error) {
    return { data: null, error: applicationsResult.error };
  }

  if (assessmentsResult.error) {
    return { data: null, error: assessmentsResult.error };
  }

  if (offersResult.error) {
    return { data: null, error: offersResult.error };
  }

  const positions = positionsResult.data || [];
  const applications = applicationsResult.data || [];
  const assessments = assessmentsResult.data || [];
  const offers = offersResult.data || [];

  // Join positions with applications, assessments, and offers
  const positionsWithApplications: PositionWithApplication[] = positions.map(
    (position) => {
      const application = applications.find(
        (app) => app.position_id === position.id
      );
      const positionAssessments = assessments.filter(
        (assessment) => assessment.position_id === position.id
      );
      const positionOffer = offers.find(
        (offer) => offer.position_id === position.id
      );

      return {
        ...position,
        application,
        assessments:
          positionAssessments.length > 0 ? positionAssessments : undefined,
        offer: positionOffer,
      };
    }
  );

  return { data: positionsWithApplications, error: null };
}

// Legacy function for backward compatibility
async function getUserApplications(
  user_id: string
): Promise<Application[] | null> {
  const result = await getApplications(user_id);
  if (result.error) {
    console.error("Error fetching applications:", result.error);
    return null;
  }
  return result.data || null;
}

export default {
  // User functions
  getUser,
  createUser,

  // Position functions
  getPositions,
  getPosition,
  createPosition,
  updatePosition,
  deletePosition,

  // Application functions
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getUserApplications, // Legacy support

  // Interview functions
  getInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview,

  // Assessment functions
  getAssessments,
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment,

  // Offer functions
  getOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer,

  // Helper functions
  getApplicationsWithPositions,
};
