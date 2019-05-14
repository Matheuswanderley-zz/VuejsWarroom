<template>
  <div class="post">
    <div
      :class="post.favorabilidade"
      class="post-bar"
    />

    <div class="post-content">
      <div
        v-if="post.image_url"
        class="post-picture"
      >
        <img
          :src="post.image_url"
          alt=""
        >
      </div>

      <h4
        v-if="isArticle"
        v-html="post.title"
      />
      <p v-else>
        {{ post.text }}
      </p>
      <!-- TAGS -->
      <!-- <span class="post-tags" v-for="tag in post.hashtags">
        <span class="post-tag">{{ tag }}</span>
      </span> -->

      <!-- DATE AND CHANNEL -->
      <div class="post-footer">
        <div
          :style="{ color: channel.color }"
          class="channel"
        >
          <icon
            :name="channel.icon"
            scale="1"
          />
          <strong>{{ post.channel }}</strong>
        </div>
        <a
          :href="post.post_url"
          target="_blank"
        >
          <small :title="formatedDate">
            {{ formatedDateFromNow }}
          </small>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import * as moment from 'moment'
  import 'moment/locale/pt-br'
  moment.locale('pt-BR')

  export default {
    props: {
      post: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data: function(){
      return {
        channels: {
          'News': {
            icon: 'newspaper',
            color: '#ffe6a2',
          },
          'Facebook': {
            icon: 'brands/facebook-f',
            color: '#91aeec',
          },
          'Twitter': {
            icon: 'brands/twitter',
            color: '#80c8ff',
          },
          'YouTube': {
            icon: 'brands/youtube',
            color: '#ffb6b8',
          },
          'Blogs': {
            icon: 'blog',
            color: '#ffe6a2',
          },
          'Comentários em Artigos': {
            icon: 'newspaper',
            color: '#ffe6a2',
          },
          'Instagram': {
            icon: 'brands/instagram',
            color: '#ffa2d5',
          },
          'Tumblr': {
            icon: 'brands/tumblr',
            color: '#a1b2c7',
          },
          'GooglePlus': {
            icon: 'brands/google-plus-g',
            color: '#ffb6b8',
          },
          default: {
            icon: 'comment-alt',
            color: '#ffe6a2',
          },
        },
      }
    },
    computed: {
      isArticle() {
        return ['News', 'Blogs'].includes(this.post.primary_channel)
      },
      formatedDate() {
        return moment(this.post.posted_at).format('DD/MM/YY HH:HH:ss')
      },
      formatedDateFromNow() {
        return moment(this.post.posted_at).fromNow()
      },
      channel() {
        return this.channels[this.post.primary_channel]
          || this.channels.default
      },
    },
  }
</script>

<style scoped>
  .post {
    text-align: left;
    margin: 1em 0 3em;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
  }

  .post-bar {
    border-radius: 3px;
    min-width: 5px;
  }

  .post-content {
    flex-grow: 1;
    max-width: 100%;
    padding: 0.1em 0 0.3em 0.7em;
  }

  .post-content h4, .post-content h4 * {
    text-transform: none;
    text-align: left;
    font-weight: 700;
    font-size: .8em;
    margin: 0 0 .5em;
    text-decoration: none!important;
  }

  .post-content p {
    font-size: .95em;
    font-weight: 400;
    margin: 0 0 .5em;
    overflow-wrap: break-word;
  }

  .post-tags {
    display: block;
    margin: 0 0 .5em;
    font-size: .8em;
    font-weight: 700;
  }
  .post-tag {
    display: inline-block;
    padding: 0 .3em;
  }
  .post-tag {

  }
  .post-footer {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .post-footer .channel {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .post-footer strong {
    padding: 0 0.6em;
    font-size: .95em;
    font-weight: 500;
  }
  .post-footer a {
    color: #b8b8b8;
    text-decoration: none;
  }
  .post-footer a:hover {
    text-decoration: underline;
  }
  .post-footer small {
  }
  .post-picture {
    margin-bottom: .5em;
    overflow: hidden;
    border-radius: 2px;
  }
  .post-picture img {
    display: block;
    width: 100%;
  }
</style>
