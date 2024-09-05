<script setup>

import { ref } from 'vue';

const myObject = ref ([
    {id:1,image: "https://image.ajunews.com/content/image/2021/04/01/20210401172848819682.jpg"},
    {id:2,image: "https://t1.daumcdn.net/cfile/tistory/99BE76495AE75A240C"},
    {id:3,image:"https://image2.gnsister.com/images/document/1681895991772_1b44852f515e42acba77a17ed691bc64.jpg?originalImageWidth=400&originalImageHeight=300"},
    {id:4,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfpqnBBMppxMDIJKvAV81cSI9y6GKg0YvFBQ&s" },
])

// 상세조회
const handlerCardClick = (id) => {
    // 상세조회(아직 미완성)
    console.log('Card with ID ${id}  clicked');

}

</script>

<template>
  <div class="p-3 m-0 border-0 bd-example m-0 border-0">
        <ul style="list-style-type: none; padding: 0;">
                <li v-for="(card, index) in myObject"
                :key="card.id" 
                @click="handlerCardClick(card.id)"
                style="display: inline-block; margin: 10px; padding: 10px; width: 18rem;">
                
                    <div class="card" style="width: 100%;">
                        
                        <a>
                            <img :src="card.image" alt="" class="card-img-top" 
                            style="width: 100%; height: 100%; aspect-ratio: 1; object-fit: cover;">
                        </a>


                    </div>

                </li>
        </ul>
    </div>

</template>
