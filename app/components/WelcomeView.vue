<template>
  <div class="flex flex-col items-center mt-4">
    <div
      class="font-michroma glass-card w-[80vw] h-[80vh] rounded-2xl flex flex-col items-center -mb-[10%]"
      style="background-size: 35px"
    >
      <h1 class="text-black/80 text-5xl font-bold mb-8 mt-4 cursor-default">
        Welcome to Tunity
      </h1>
      <p
        class="text-black/80 text-xl text-center max-w-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] cursor-default"
      >
        Start tracking your application process here.
      </p>
      <div
        class="text-black/80 flex gap-4 w-full h-full text-center mt-4 mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] cursor-default"
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
