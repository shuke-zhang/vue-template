<script setup lang="ts">
import { logger } from '@shuke~/logger';

const sss = ref(0);

logger.info('logger.info');
logger.warn('logger.warn');
logger.error('logger.error');
logger.success('logger.success');
</script>

<template>
  <div>
    sss:{{ sss }}
    <div class="grid grid-cols-2 gap-2 my-4">
      <div class="p-2 rounded text-mint-500 ">
        mint-500
      </div>
      <div class="p-2 rounded text-primary ">
        primary
      </div>
      <div class="p-2 rounded text-error ">
        error
      </div>
      <div class="p-2 rounded text-onPrimaryContainer bg-primaryContainer">
        primaryContainer
      </div>
      <div class="p-2 rounded text-onSecondary bg-secondary">
        secondary
      </div>
      <div class="p-2 rounded text-onSecondaryContainer bg-secondaryContainer">
        secondaryContainer
      </div>
      <div class="p-2 rounded text-onTertiary bg-tertiary">
        tertiary
      </div>
      <div class="p-2 rounded text-onTertiaryContainer bg-tertiaryContainer">
        tertiaryContainer
      </div>
      <div class="p-2 rounded text-error bg-error">
        error
      </div>
      <div class="p-2 rounded text-onErrorContainer bg-errorContainer">
        errorContainer
      </div>
      <div class="p-2 rounded text-onBackground bg-background">
        background
      </div>
      <div class="p-2 rounded text-onSurface bg-surface">
        surface
      </div>
      <div class="p-2 rounded text-onSurfaceVariant bg-surfaceVariant">
        surfaceVariant
      </div>
      <div class="p-2 rounded text-inverseOnSurface bg-inverseSurface">
        inverseSurface
      </div>
      <div class="p-2 rounded text-inversePrimary bg-inversePrimary">
        inversePrimary
      </div>
      <div class="p-2 rounded text-onPrimaryFixed bg-primaryFixed">
        primaryFixed
      </div>
      <div class="p-2 rounded text-onPrimaryFixedVariant bg-primaryFixedDim">
        primaryFixedDim
      </div>
      <div class="p-2 rounded text-onSecondaryFixed bg-secondaryFixed">
        secondaryFixed
      </div>
      <div class="p-2 rounded text-onSecondaryFixedVariant bg-secondaryFixedDim">
        secondaryFixedDim
      </div>
      <div class="p-2 rounded text-onTertiaryFixed bg-tertiaryFixed">
        tertiaryFixed
      </div>
      <div class="p-2 rounded text-onTertiaryFixedVariant bg-tertiaryFixedDim">
        tertiaryFixedDim
      </div>
      <div class="p-2 rounded text-onSurfaceVariant bg-surfaceDim">
        surfaceDim
      </div>
      <div class="p-2 rounded text-onSurface bg-surfaceBright">
        surfaceBright
      </div>
      <div class="p-2 rounded text-onSurface bg-surfaceContainerLowest">
        surfaceContainerLowest
      </div>
      <div class="p-2 rounded text-onSurface bg-surfaceContainerLow">
        surfaceContainerLow
      </div>
      <div class="p-2 rounded text-onSurface bg-surfaceContainer">
        surfaceContainer
      </div>
      <div class="p-2 rounded text-onSurface bg-surfaceContainerHigh">
        surfaceContainerHigh
      </div>
      <div class="p-2 rounded text-onSurface bg-surfaceContainerHighest">
        surfaceContainerHighest
      </div>
    </div>
  </div>
</template>
