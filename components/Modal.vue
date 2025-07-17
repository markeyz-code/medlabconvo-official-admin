<!-- <template>
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="modelValue"
          class="fixed inset-0 bg-black bg-opacity-50 flex backdrop-blur-lg items-center justify-center z-50 p-4"
          @click="closeModal"
        >
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-300"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="modelValue"
              :class="[
                'bg-white rounded-xl shadow-xl w-full max-h-[90vh] overflow-y-auto',
                size === 'sm' ? 'max-w-md' :
                size === 'lg' ? 'max-w-2xl' :
                size === 'xl' ? 'max-w-4xl' :
                'max-w-lg'
              ]"
              @click.stop
            >
              <div class="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
                <button
                  @click="closeModal"
                  class="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Icon name="heroicons:x-mark" class="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div class="p-6">
                <slot />
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  interface Props {
    modelValue: boolean
    title: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }
  
  const props = withDefaults(defineProps<Props>(), {
    size: 'md'
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const closeModal = () => {
    emit('update:modelValue', false)
  }
  </script>
   -->


   <template>
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="modelValue"
          class="fixed inset-0 bg-black bg-opacity-50 flex backdrop-blur-lg items-center justify-center z-50 p-4"
        >
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-300"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="modelValue"
              :class="[
                'bg-white rounded-xl shadow-xl w-full max-h-[90vh] overflow-y-auto',
                size === 'sm' ? 'max-w-md' :
                size === 'lg' ? 'max-w-2xl' :
                size === 'xl' ? 'max-w-4xl' :
                'max-w-lg'
              ]"
              @click.stop
            >
              <!-- Header -->
              <div class="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
                <button
                  @click="closeModal"
                  class="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Icon name="heroicons:x-mark" class="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <!-- Content -->
              <div class="p-6">
                <slot />
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  interface Props {
    modelValue: boolean
    title: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }
  
  const props = withDefaults(defineProps<Props>(), {
    size: 'md'
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const closeModal = () => {
    emit('update:modelValue', false)
  }
  </script>