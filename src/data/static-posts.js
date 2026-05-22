let postsData = [];

for (let i = 1; i <= 25; i++) {
    postsData.push({
        _id: `mock-id-${i}`,
        title: `Статический пост №${i}`,
        content: `Это контент тестового поста под номером ${i}.`,
        category: i % 2 === 0 ? "news" : "sport",
        author: "65f1c2b3e4b0a123456789ab",
        createdAt: new Date(Date.now() - i * 3600000).toISOString(), // Разное время создания
        updatedAt: new Date().toISOString()
    });
}

export default postsData;