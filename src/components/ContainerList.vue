<!-- src/components/ContainerList.vue -->
<template>
  <div>
    <h2>Container</h2>
    <button @click="openCreateModal">Neuen Container hinzufügen</button>
    <ul>
      <li v-for="container in containers" :key="container.id">
        <strong>ID:</strong> {{ container.id }} |
        <strong>Beschreibung:</strong> {{ container.description }} |
        <strong>Gewicht:</strong> {{ container.weight }} kg |
        <strong>Schiff:</strong> {{ container.ship.name }}
        <button @click="editContainer(container)">Bearbeiten</button>
        <button @click="deleteContainer(container.id)">Löschen</button>
      </li>
    </ul>
    <ContainerForm
        v-if="showForm"
        :container="selectedContainer"
        @close="closeForm"
        @saved="fetchContainers"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import apiService from '../services/apiService';
import ContainerForm from './ContainerForm.vue';
import webSocketService from '../services/websocketService';

export default {
  components: { ContainerForm },
  setup() {
    const containers = ref([]);
    const showForm = ref(false);
    const selectedContainer = ref(null);

    const fetchContainers = () => {
      apiService.getContainers().then(response => {
        containers.value = response.data;
      });
    };

    const openCreateModal = () => {
      selectedContainer.value = null;
      showForm.value = true;
    };

    const editContainer = container => {
      selectedContainer.value = container;
      showForm.value = true;
    };

    const deleteContainer = id => {
      if (confirm('Sind Sie sicher, dass Sie diesen Container löschen möchten?')) {
        apiService.deleteContainer(id).then(() => {
          fetchContainers();
        }).catch(error => {
          alert('Fehler beim Löschen des Containers.');
          console.error(error);
        });
      }
    };

    const closeForm = () => {
      showForm.value = false;
    };

    const handleWebSocketMessage = message => {
      const body = JSON.parse(message.body);
      // Aktualisiere die Containerliste basierend auf der Nachricht
      fetchContainers();
    };

    onMounted(() => {
      fetchContainers();
      webSocketService.connect();
      webSocketService.subscribe('/topic/containers', handleWebSocketMessage);
    });

    return {
      containers,
      showForm,
      selectedContainer,
      openCreateModal,
      editContainer,
      deleteContainer,
      closeForm,
      fetchContainers,
    };
  },
};
</script>

<style scoped>
button {
  margin-left: 10px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
