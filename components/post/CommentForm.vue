<template>
    <div class="comment-form">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg lg:text-2xl font-bold">Discussion (20)</h2>
        </div>
        <form class="mb-6">
            <div class="py-2 px-4 mb-4 rounded-lg bg-slate-800">
                <label for="comment" class="sr-only">Your comment</label>
                <textarea
                    id="comment"
                    rows="6"
                    class="px-0 w-full border-0 focus:ring-0 outline-none bg-slate-800"
                    placeholder="Write a comment..."
                    required
                ></textarea>
            </div>
            <UButton color="pink" variant="solid" label="Post comment" />
        </form>
    </div>
</template>
