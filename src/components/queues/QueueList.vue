<template>
  <QueueAddModal @add-new-queue="(newQueue) => queueList.push(newQueue)"
    @set-is-error="(isErrorVal) => (this.isError = isErrorVal)" />
  <div v-if="isError" class="alert alert-danger m-0 p-3" role="alert">
    Что-то пошло не так!
  </div>
  <div v-if="isLoading">
    <Spinner />
  </div>
  <div v-else>
    <AdminNav />
    <div class="container">
      <div class="main-content">
        <div v-if="sortedQueueList.length > 0" class="sidebar">
          <h5 class="mb-3">Список электронных очередей</h5>
          <button type="button" class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addNewQueue">
            Добавить очередь
          </button>

          <section class="top-nav">

            <input id="menu-toggle" type="checkbox" />
            <label class='menu-button-container' for="menu-toggle">
              <div class='menu-button'></div>
            </label>
            <div class="menu">
              <div v-for="queue in sortedQueueList" :key="queue.id" class="cards">
                <router-link :to="{ name: 'queue_appointments', params: { id: queue.id } }" class="fs-5 fw-bold h-text"
                  v-if="queue.is_active">
                  {{ queue.queue_name }}
                </router-link>
                <router-link :to="{ name: 'queue_appointments', params: { id: queue.id } }"
                  class="fs-5 fw-bold link-secondary h-text" v-else>
                  {{ queue.queue_name }}
                </router-link>
                <br />
                <div v-if="queue.appointment_count > 0" class="text">
                  Всего записей - {{ queue.appointment_count }} Свободных -
                  {{ queue.get_free_appointment_count }} Занято -
                  {{ queue.get_booked_appointment_count }}
                </div>
                <div v-else class="text">Очередь не сформирована</div>
              </div>
            </div>
          </section>


        </div>
        <div v-else>
          <h5>Список пуст</h5>
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addNewQueue">
            Добавить очередь
          </button>
        </div>

        <div style="width: 100%" class="m-2" v-if="sortedQueueList.length > 0">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queueAPI } from "@/api/queueAPI"
import { mapGetters } from "vuex"
import Spinner from "@/components/common/Spinner"
import QueueAddModal from "@/components/queues/QueueAddModal"
import AdminNav from "@/components/common/AdminNav"

export default {
  name: "QueueList",
  components: { AdminNav, Spinner, QueueAddModal },
  data() {
    return {
      queueList: [],
      isLoading: true,
      isError: false
    }
  },
  async created() {
    try {
      const response = await queueAPI.getQueueList(this.userToken)
      this.queueList = await response.data
    } catch (e) {
      this.isError = true
    } finally {
      this.isLoading = false
    }
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken"
    }),
    sortedQueueList() {
      return this.queueList
    }
  }
}
</script>

<style scoped>
/* fffffffffffffffffffff */
#menu-toggle {
  display: none;
}

/* fffffffffffffffff */

.cards {
  border: 1px solid #000;
  margin: 10px;
  border-radius: 10px;
  padding: 4px;
}

.cards a {
  text-decoration: none;
  color: cadetblue;
}

.cards a:hover {

  color: rgb(126, 210, 212);
}

.main-content {
  display: flex;
  flex-direction: row;
}

.sidebar {
  width: 30%;
}

@media (max-width: 968px) {

  .main-content {
    display: flex;
    flex-direction: column;
  }

  .sidebar {
    display: flex;
    justify-content: center;
    width: 100%;
    flex-direction: column;
    margin-bottom: 10px;
  }

  .top-nav {
    position: relative;
  }

  .menu-button-container {
    display: flex;
    margin-top: 20px;
    justify-content: flex-start;
  }


  .cards {
    margin: 0 1rem;
    overflow: hidden;

  }



  .cards .text {
    font-size: .7em;
  }

  #menu-toggle~.menu .cards {
    height: 0;
    margin: 0;
    padding: 0;
    border: 0;
    transition: height 400ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  #menu-toggle:checked~.menu .cards {
    border: 1px solid #333;
    height: 8em;
    padding: 0.5em;
    margin-bottom: 10px;
    transition: height 400ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  .menu-button,
  .menu-button::before,
  .menu-button::after {
    display: block;
    background-color: #000;
    position: absolute;
    height: 4px;
    width: 40px;
    border-radius: 2px;
  }

  .menu-button::before {
    content: "";
    margin-top: 8px;
  }

  .menu {

    top: 0;
    margin-top: 50px;
    left: 0;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .menu-button::after {
    content: "";
    margin-top: -8px;
  }


}
</style>
