<template>
  <div class="min-h-screen">
    <header class="border-b">
      <div class="flex h-16 items-center px-4">
        <NuxtLink to="/" class="mr-6 flex items-center space-x-2">
          <div class="font-bold">H0ST3D</div>
        </NuxtLink>
        <nav class="flex items-center space-x-4 lg:space-x-6 mx-6">
          <NuxtLink
            to="/"
            class="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/plugins"
            class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Plugins
          </NuxtLink>
          <NuxtLink
            to="/registries"
            class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Registries
          </NuxtLink>
        </nav>
      </div>
    </header>
    <slot />
  </div>
</template>
