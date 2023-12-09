<template>
    <div class="notes-container">
        <div v-if="notes.length === 0" class="no-notes-message">
            <i class="pi pi-exclamation-triangle"></i> No notes found.
        </div>
        <div v-else>
            <div v-for="note in notes" :key="note.id" class="card mb-3">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="created-info">
                                <div>{{ note.created_by?.name }}</div>
                                <div>{{ note.created_at }}</div>
                            </div>
                        </div>
                        <div class="col-md-9">
                            <div class="note-content">
                                {{ note.notes }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

  
<script setup>
import { ref ,onMounted} from 'vue';
import { useRouter } from 'vue-router';
import axiosIns from '../../../service/axios';
const router = useRouter()

const notes = ref([]);

const fetchUserData = async (customerId) => {
    try {
        const response = await axiosIns.get(`/notes/list/${customerId}`);
        notes.value = response.data.notes;
    
    } catch (error) {
        console.error('Error fetching notes data:', error);
    }
};
onMounted(async () => {
const customerId = router.currentRoute.value.params.id;
if (customerId) {
    await fetchUserData(customerId);
}
});
</script>
  
<style scoped>
.notes-container {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease; /* Add transition for smooth effect */
}

.card:hover {
  transform: perspective(1000px) rotateY(10deg); /* Apply 3D rotation on hover */
}

.created-info {
  font-weight: bold;
  margin-bottom: 10px;
}

.note-content {
  white-space: pre-line;
}

.no-notes-message {
        text-align: center;
        padding: 20px;
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        border-radius: 5px;
        margin-bottom: 20px;
    }

    .no-notes-message i {
        margin-right: 5px;
        color: #721c24;
    }
</style>
  