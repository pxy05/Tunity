<script setup lang="ts">
import useApi from "~/composables/useApi";
import useContext from "~/context/tempcontext";

const { createUser } = useApi;
const { loadUserData } = useContext();

const inputBoxClass =
  "flex flex-row gap-2 pr-2 glass-card rounded-xl h-12 items-center text-center hover-expand-ui";

const username = ref("");
const firstname = ref("");
const lastname = ref("");
const createUserError = ref("");

const submit = async () => {
  createUserError.value = await createUser(
    username.value,
    firstname.value,
    lastname.value
  );
  if (createUserError.value) {
    console.log(createUserError.value);
  } else {
    createUserError.value = "User created successfully";
    await loadUserData();
  }
};
</script>

<template>
  <div>
    <div class="flex flex-col items-center mt-4">
      <div
        class="font-michroma glass-card w-[80vw] h-[80vh] rounded-2xl flex -mb-[10%] gap-4"
        style="
          background-image: url(&quot;data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><circle cx=%2250%22 cy=%2250%22 r=%223.5%22 fill=%22none%22 stroke=%22white%22 stroke-width=%221.5%22 opacity=%220.3%22/></svg>&quot;);
          background-size: 100px 100px;
          background-position: 20px -5px;
        "
      >
        <div
          class="flex-1 glass-card m-4 mr-0 pl-2 pt-8 hover-expand-card text-black/80"
        >
          <h1 class="text-4xl/18 font-bold m-4 text-left">
            Finish <br />
            creating <br />
            your profile <br />
            to begin tracking your applications.
          </h1>
        </div>
        <div class="flex-2 glass-card m-4 ml-0">
          <form @submit.prevent="submit">
            <div
              class="text-black/80 flex flex-col gap-4 text-xl text-bold p-4"
            >
              <div :class="inputBoxClass">
                <label for="username" class="pl-4 whitespace-nowrap w-40"
                  >Username*:</label
                >
                <input
                  v-model="username"
                  type="text"
                  id="username"
                  class="w-full border-solid border-2 border-gray-300/50 rounded-md"
                />
              </div>
              <div :class="inputBoxClass">
                <label for="firstname" class="pl-4 whitespace-nowrap w-40"
                  >First Name:</label
                >
                <input
                  v-model="firstname"
                  type="text"
                  id="firstname"
                  class="w-full border-solid border-2 border-gray-300/50 rounded-md"
                />
              </div>
              <div :class="inputBoxClass">
                <label for="lastname" class="pl-4 whitespace-nowrap w-40"
                  >Last Name:</label
                >
                <input
                  v-model="lastname"
                  type="text"
                  id="lastname"
                  class="w-full border-solid border-2 border-gray-300/50 rounded-md"
                />
              </div>
              <div
                class="flex flex-row gap-2 pr-4 glass-card rounded-xl h-12 items-center text-center hover-expand-card cursor-pointer"
              >
                <button type="submit" class="w-full cursor-pointer">
                  Submit
                </button>
                <p v-if="createUserError" class="text-red-500">
                  {{ createUserError }}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
