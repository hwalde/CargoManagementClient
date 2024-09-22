<!-- src/components/ContainerForm.vue -->
<template>
  <div class="modal">
    <div class="modal-content">
      <h3>{{ container ? 'Container bearbeiten' : 'Neuen Container hinzufügen' }}</h3>
      <form @submit.prevent="saveContainer">
        <div>
          <label>Beschreibung:</label>
          <input v-model="form.description" maxlength="500" required />
        </div>
        <div>
          <label>Gewicht (kg):</label>
          <input type="number" step="0.01" v-model.number="form.weight" required />
        </div>
        <div>
          <label>Schiff:</label>
          <select v-model.number="form.shipId" required>
            <option disabled value="">Bitte wählen</option>
            <option v-for="ship in ships" :key="ship.id" :value="ship.id">
              {{ ship.name }} (ID: {{ ship.id }})
            </option>
          </select>
        </div>
        <div class="buttons">
          <button type="submit">Speichern</button>
          <button type="button" @click="$emit('close')">Abbrechen</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import apiService from '../services/apiService';

export default {
  props: ['container'],
  setup(props, { emit }) {
    const form = ref({
      description: '',
      weight: null,
      shipId: '',
    });

    const ships = ref([]);

    const fetchShips = () => {
      apiService.getShips().then(response => {
        ships.value = response.data;
      }).catch(error => {
        alert('Fehler beim Laden der Schiffe.');
        console.error(error);
      });
    };

    watch(
        () => props.container,
        newContainer => {
          if (newContainer) {
            form.value = {
              description: newContainer.description,
              weight: newContainer.weight,
              shipId: newContainer.ship.id,
            };
          } else {
            form.value = {
              description: '',
              weight: null,
              shipId: '',
            };
          }
        },
        { immediate: true }
    );

    const saveContainer = () => {
      const payload = {
        description: form.value.description,
        weight: form.value.weight,
        ship: {
          id: form.value.shipId,
        },
      };

      if (props.container) {
        // Update
        apiService.updateContainer(props.container.id, payload).then(() => {
          emit('saved');
          emit('close');
        }).catch(error => {
          alert('Fehler beim Aktualisieren des Containers.');
          console.error(error);
        });
      } else {
        // Create
        apiService.createContainer(payload).then(() => {
          emit('saved');
          emit('close');
        }).catch(error => {
          alert('Fehler beim Erstellen des Containers.');
          console.error(error);
        });
      }
    };

    onMounted(() => {
      fetchShips();
    });

    return {
      form,
      ships,
      saveContainer,
    };
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}
form div {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input, select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.buttons {
  display: flex;
  justify-content: flex-end;
}
button {
  margin-left: 10px;
}
</style>
