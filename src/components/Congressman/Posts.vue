<template>
  <div class="posts-list">
    <!-- IF -->
    <div
      v-if="(loaded && hasPosts)"
      class="last-posts"
    >
      <user-post
        v-for="post in currentPosts"
        :key="post.id"
        :post="post"
      />
    </div>

    <!-- ELSE IF -->
    <div
      v-else-if="loaded"
      class="no-posts"
    >
      <div class="no-posts-icon">
        <icon label="No Photos">
          <icon
            name="comment-alt"
            class="faded"
            scale="2"
          />
          <icon
            name="ban"
            scale="4"
          />
        </icon>
      </div>
      <span>Sem publicações recentes</span>
    </div>

    <!-- ELSE -->
    <div
      v-else
      class="loading"
    >
      <icon
        name="circle-notch"
        spin
        scale="6"
      />
    </div>
  </div>
</template>

<script>
  import UserPost from './Post.vue'


  export default {
    components: {
      UserPost,
    },
    props: {
      user: {
        type: Object,
      },
    },
    data: function(){
      return {
        loaded: false,
        currentPosts: null,
        cachedPosts: {},
      }
    },
    computed: {
      hasPosts() {
        return this.currentPosts && this.currentPosts.length
      },
    },
    watch: {
      user: {
        handler() {
          this.fetchPosts()
        },
      },
    },
    methods: {
      fetchPosts() {
        if (!this.user) return
        const id = this.user.id
        const cachedPosts = this.cachedPosts[id]
        if (cachedPosts) {
          this.currentPosts = cachedPosts
          this.loaded = true
        } else {
          this.loaded = false
          this.$api('posts', id)
            .then(({ data }) => {
              this.currentPosts = data.data || []
              this.cachedPosts[id] = this.currentPosts
              this.loaded = true
            })
        }
      },
    },
  }
</script>

<style scoped>


  .posts-list {

  }

  .posts-list .loading,
  .posts-list .no-posts {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 33vh;
    padding: 0;
  }
  .posts-list .no-posts {
    font-weight: 900;
    opacity: .3;
    border-radius: 10px;
    padding: 3em;
    background-color: rgba(255, 255, 255, .2);
  }
  .no-posts-icon {
    display: block;
    text-align: center;
    width: 100%;
    height: 5em;
    opacity: .5;
  }
  .no-posts-icon .faded {
    opacity: .8;
  }
</style>
