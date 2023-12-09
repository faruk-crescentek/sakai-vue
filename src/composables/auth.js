import { ref, reactive, inject } from 'vue';
import { useRouter } from 'vue-router';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { ABILITY_TOKEN } from '@casl/vue';

import store from '../store';
import axiosIns from '../service/axios';

let user = reactive({
    name: '',
    email: ''
});

export default function useAuth() {
    const processing = ref(false);
    const router = useRouter();
    const ability = inject(ABILITY_TOKEN)

    const loginForm = reactive({
        email: '',
        password: '',
        remember: false
    });

    const submitLogin = async () => {
        try {
            const response = await axiosIns.post('/login', loginForm);
            
            const accessToken = response.data.accessToken;
            const userAbilities = response.data.userAbilities;

         
            localStorage.setItem('accessToken', JSON.stringify(accessToken));
            localStorage.setItem('userAbilities', JSON.stringify(userAbilities));

            
            await store.dispatch('auth/getUser');
            await getUserAbilities(); 
            await loginUser();

            await router.push('/');
        } catch (error) {
            // Handle error
            alert("Login failed");
            console.error('Login failed:', error);
        }
    };

    const loginUser = () => {
        user = store.state.auth.user;
        getUserAbilities()

    };

    const getUser = async () => {
        if (store.getters['auth/authenticated']) {
            await store.dispatch('auth/getUser');
            await loginUser();
        }
    };

    const logout = async () => {
        if (processing.value) return;

        processing.value = true;

        axiosIns
            .post('/logout')
            .then((response) => {
                user.name = '';
                user.email = '';
                store.dispatch('auth/logout');
                router.replace('/login');
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {});
    };

    async function getUserAbilities() {
        try {
          const abilitiesJson = localStorage.getItem('userAbilities');
      
          if (abilitiesJson) {
            const abilities = JSON.parse(abilitiesJson);
      
            const { can, rules } = new AbilityBuilder(createMongoAbility);
            can(abilities);
      
            ability.update(rules);
          } else {
            console.error('User abilities not found in localStorage');
          }
        } catch (error) {
          console.error('Error retrieving user abilities:', error);
        }
      }
      

    return {
        loginForm,
        submitLogin,
        user,
        getUser,
        logout,
    };
}
