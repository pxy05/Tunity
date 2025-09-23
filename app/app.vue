<script setup lang="ts">
import '~/assets/css/main.css'

//Auth
import { createClient } from '@supabase/supabase-js'
const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl as string, config.public.supabasePublishableKey as string)
const instruments = ref([])

async function getInstruments() {
  const { data } = await supabase.from('instruments').select()
  instruments.value = data
}

</script>

<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
