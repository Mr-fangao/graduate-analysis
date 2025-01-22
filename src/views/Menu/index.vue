<template>
    <div class="container">
        <div class="card-list">
            <div v-for="card in cards" :key="card.id" class="card" @click="pushRouter(card.id)">
                {{ card.content }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
interface Card {
    id: number;
    content: string;
}
const cards = ref<Card[]>([]);

const generateCards = () => {
    for (let i = 1; i <= 10; i++) {
        cards.value.push({
            id: i,
            content: `Card ${i}`,
        });
    }
};
function pushRouter(id: string) {
    console.log(id);
    router.push(`/home`);
}
onMounted(() => {
    generateCards();
});
</script>
<style scoped>
.container {
    padding: 50px;
    /* margin: 20px; */
    overflow-y: auto;
    /* 允许垂直滚动 */
    /* scrollbar-gutter: stable; */
    /* 预留滚动条空间 */
    height: calc(100vh - 100px);
    /* 留出上下边距 */
    background-image: url("/img/BG/1.jpg");
    background-size: 100% 100%;
}

.container::-webkit-scrollbar {
    width: 12px;
}

.container::-webkit-scrollbar-track {
    background: #ffffff18;
    border-radius: 10px;
}

.container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

.container::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.card-list {
    display: flex;
    flex-direction: row;
    gap: 24px;
    flex-wrap: wrap;
    /* justify-content: space-around; */
    /* 卡片之间的间隔 */
}

.card {
    width: 300px;
    height: 220px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f99d;
    text-align: center;
}
</style>