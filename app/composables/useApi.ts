import type { Application, User } from "~/assets/types/database";

function getApiUrl() {
  const config = useRuntimeConfig();
  return config.public.tunityApiUrl;
}

async function getUser(user_id: string | undefined): Promise<User | null> {
  if (!user_id) {
    return null;
  }
  const apiURL = getApiUrl();
  const response = await fetch(`${apiURL}/users/${user_id}`);
  const data = await response.json();

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const user: User = {
      id: data.id,
      created_at: data.created_at,
      username: data.username,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      updated_at: data.updated_at,
    };
    return user;
  }

  return null;
}

async function getUserApplications(
  user_id: string
): Promise<Application[] | null> {
  if (!user_id) {
    return null;
  }

  const apiURL = getApiUrl();
  const response = await fetch(`${apiURL}/users/applications/${user_id}`);
  const data = await response.json();

  const applications: Application[] = [];

  for (const item of data) {
    const application: Application = {
      id: item.id,
      user_id: item.user_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      company: item.company,
      status: item.status,
      appli_title: item.appli_title,
      appli_location: item.appli_location,
      appli_notes: item.appli_notes,
      appli_url: item.appli_url,
      appli_deadline: item.appli_deadline,
      appli_rejected: item.appli_rejected,
      interview_failed_date: item.interview_failed_date,
      interview_failed_reason: item.interview_failed_reason,
    };
    applications.push(application);
  }

  return applications;
}

async function createUser(
  username: string,
  firstname: string | null,
  lastname: string | null
) {
  const apiURL = getApiUrl();

  if (!username || username.trim() === "") {
    throw new Error("Username is required");
  }

  if (
    !firstname ||
    !lastname ||
    firstname.trim() === "" ||
    lastname.trim() === ""
  ) {
    const response = await fetch(`${apiURL}/users`, {
      method: "POST",
      body: JSON.stringify({
        id: useSupabaseUser().value?.id,
        username: username,
      }),
    });
    const data = await response.json();
    return data;
  }

  const response = await fetch(`${apiURL}/users`, {
    method: "POST",
    body: JSON.stringify({
      id: useSupabaseUser().value?.id,
      username: username,
      first_name: firstname,
      last_name: lastname,
    }),
  });
}

export default {
  getUser,
  getUserApplications,
  createUser,
};
