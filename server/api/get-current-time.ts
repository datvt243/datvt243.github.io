export default defineEventHandler(async (event) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return {
        data: +new Date(),
    };
});
