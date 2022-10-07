<template>
  <div class="containers">
    <div class="wrpper colum_wr">
      <h1 class="error_text_404">404</h1>
      <img src="@/assets/no_conect.png" alt="" class="img_error">
      <h2 class="error_h2">Opps</h2>
      <h3 class="error_h3">Something went wrong.</h3>
      <h3 class="error_h3"> prease try again.</h3>

    </div>
  </div>
</template>

<script>
export default {
  name: "NotFoundView",
}
</script>

<style scoped>
.colum_wr {

  flex-direction: column;
}

.error_text_404 {
  font-size: 100px;
  color: #e94560;
}

.error_h2 {
  font-size: 50px;
  color: #e94560;
}

.error_h3 {
  font-size: 30px;
}

.img_error {
  width: 100%;
}

.containers {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(60deg, #16213e, #61a4bc, #fe7e6d, #e94560);
  background-size: 500%;
  animation: gradientAnimation 35s ease infinite;


}

@keyframes gradientAnimation {
  0% {
    background-position: 0 50%;
  }

  30% {
    background-position: 50% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  70% {
    background-position: 50% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
