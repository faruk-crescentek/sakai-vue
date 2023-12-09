<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onBeforeMount, onMounted } from 'vue';
import axiosIns from '../../../service/axios';
import { useToast } from 'primevue/usetoast';
const customers = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const toast = useToast();
const display = ref(false);
const notes = ref({
    note: '',
    followUpDate: '',
    customer_id: null,
});
onBeforeMount(() => {
    initFilters1();
});

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        companyName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        date: { value: null, matchMode: FilterMatchMode.DATE_IS },
        customerType: { value: null, matchMode: FilterMatchMode.IN },
    };
};

const clearFilter1 = () => {
    initFilters1();
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const deleteCustomer = async (id) => {
    try {
        await axiosIns.delete(`/customers/${id}`);
        customers.value = customers.value.filter((u) => u.id !== id);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Customer Deleted', life: 6000 });

    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error Deleting Customer', life: 6000 });

        console.error('Error Deleting Customer:', error);
    }
};

const saveFollowUp = async () => {

    try {
        await axiosIns.post('/notes/create', notes.value);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Followup Created', life: 6000 });
        notes.value = {}
        display.value = false
    } catch (error) {
        console.error('Error creating user:', error);
    }
};


const noteAction = (id) => {
    display.value = true
    notes.value.customer_id = id;
}

const close = () => {
    display.value = false;
};


onMounted(async () => {
    try {
        const response = await axiosIns.get('/customers');
        const data = await response.data.data;
        customers.value = data;
        loading1.value = false;

        customers.value.forEach((customer) => {
            customer.date = new Date(customer.date);
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        loading1.value = false;
    }
});
</script>

<template>
    <Toast />

    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Filter Menu</h5>
                <DataTable :value="customers" :paginator="true" class="p-datatable-gridlines" :rows="10" dataKey="id"
                    :rowHover="true" v-model:filters="filters1" filterDisplay="menu" :loading="loading1" :filters="filters1"
                    responsiveLayout="scroll"
                    :globalFilterFields="['companyName', 'keyPerson', 'contact', 'email', 'reference']">
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <div class="flex justify-content-between gap-3">
                                <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2"
                                    @click="clearFilter1()" />
                                <router-link to="/customers/add" class="p-button p-component p-button-outlined mb-2">Add
                                    customer</router-link>
                            </div>
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search"
                                    style="width: 100%" />
                            </span>
                        </div>
                    </template>
                    <template #empty> No customers found. </template>
                    <template #loading> Loading customers data. Please wait. </template>
                    <Column field="companyName" header="Company name" style="min-width: 12rem"
                        :showFilterMatchModes="false">
                        <template #body="{ data }">
                            {{ data.companyName }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                                placeholder="Search by name" />
                        </template>
                    </Column>
                    <Column header="Key person" filterField="keyPerson" :showFilterMatchModes="false"
                        :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="{ data }">
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{
                                data.keyPerson }}</span>
                        </template>
                    </Column>
                    <Column header="Contact no." filterField="contact" :showFilterMatchModes="false"
                        :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="{ data }">
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{
                                data.contactNo }}</span>
                        </template>
                    </Column>
                    <Column header="Email" filterField="email" :showFilterMatchModes="false"
                        :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="{ data }">
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{
                                data.email }}</span>
                        </template>
                    </Column>
                    <Column header="Address" filterField="address" :showFilterMatchModes="false"
                        :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="{ data }">
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{
                                data.address }}</span>
                        </template>
                    </Column>
                    <Column field="customerType" header="Customer type" :showFilterMatchModes="false"
                        :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                        <template #body="{ data }">
                            <span :class="'customer-badge status-' + data.status">{{ data.customerType }}</span>
                        </template>
                    </Column>
                    <Column header="Product type" filterField="productType" :showFilterMatchModes="false"
                        :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="{ data }">
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{
                                data.productType }}</span>
                        </template>
                    </Column>
                    <Column header="Purchase plan" filterField="purchasePlan" :showFilterMatchModes="false"
                        :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="{ data }">
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{
                                data.purchasePlan }}</span>
                        </template>
                    </Column>
                    <Column header="Suggested model" filterField="suggestedModel" :showFilterMatchModes="false"
                        :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="{ data }">
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{
                                data.suggestedModel }}</span>
                        </template>
                    </Column>
                    <Column header="Reference" filterField="reference" :showFilterMatchModes="false"
                        :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="{ data }">
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{
                                data.reference }}</span>
                        </template>
                    </Column>
                    <Column header="Date" filterField="date" dataType="date" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatDate(data.date) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <Calendar v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" />
                        </template>
                    </Column>
                    <Column header="Token" dataType="numeric" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ data.token }}
                        </template>
                    </Column>

                    <Column header="Actions" style="min-width: 10rem">
                        <template #body="{ data }">
                            <div>
                                <router-link :to="'/customers/edit/' + data.id">
                                    <i class="pi pi-pencil"
                                        style="cursor: pointer; margin-right: 8px; color: #28A745; font-size: 18px;"
                                        v-tooltip="'Edit Customer'"></i>
                                </router-link>
                                <i @click="noteAction(data.id)" class="pi pi-book"
                                    style="cursor: pointer; margin-right: 8px; color: #17A2B8; font-size: 18px;"
                                    v-tooltip="'Follow up'"></i>
                                <router-link :to="'/customers/notes/' + data.id">
                                    <i class="pi pi-eye"
                                        style="cursor: pointer; margin-right: 8px; color: #3F51B5; font-size: 18px;"
                                        v-tooltip="' View Follow up'"></i>
                                </router-link>

                                <i @click="deleteCustomer(data.id)" class="pi pi-trash"
                                    style="cursor: pointer; color: #DC3545; font-size: 18px;"
                                    v-tooltip="'Delete Customer'"></i>
                            </div>
                        </template>

                    </Column>
                </DataTable>
            </div>
        </div>
    </div>

    <Dialog header="Follow Up" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '40vw' }"
        :modal="true">
        <div>
            <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-12 p-md-6">
                    <label for="followUpDate" class="p-d-block" style="margin-bottom: 5px;">Follow-up Date:</label>
                    <Calendar v-model="notes.followUpDate" id="followUpDate" showIcon></Calendar>
                </div>
                <div class="p-field p-col-12 p-md-6">
                    <label for="notes" class="p-d-block" style="margin-bottom: 5px;">Notes:</label>
                    <Textarea v-model="notes.note" id="notes" rows="5"></Textarea>
                </div>
            </div>

            <div class="p-d-flex p-jc-end p-mt-3">
                <Button label="Save" @click="saveFollowUp" icon="pi pi-check" class="p-button-success p-mr-2" />
                <Button label="Cancel" @click="close" icon="pi pi-times" class="p-button-danger" />
            </div>
        </div>
    </Dialog>
</template>

<style scoped lang="scss">
::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
