import { ApifyClient } from "apify-client";

const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
});

export async function scrapeInstagram(username) {
    try {
        // Start Actor
        const run = await client.actor("dSCLg0C3YEZ83HzYX").call({
            usernames: [username],
        });

        // Get Dataset
        const { items } = await client
            .dataset(run.defaultDatasetId)
            .listItems();

        if (!items.length) {
            throw new Error("Instagram profile not found");
        }

        const profile = items[0];

        return {
            username: profile.username,
            fullName: profile.fullName,
            biography: profile.biography,
            followers: profile.followersCount,
            following: profile.followsCount,
            postsCount: profile.postsCount,
            verified: profile.verified,
            businessCategory: profile.businessCategoryName,
            website: profile.externalUrl,
            profilePic: profile.profilePicUrl,
            latestPosts: profile.latestPosts || [],
            raw: profile
        };

    } catch (err) {
        console.error(err);
        throw err;
    }
}