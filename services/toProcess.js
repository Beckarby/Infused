import api from './api';

export const toProcessService = {
    async toProcess(tx, params) {
        try {
            const response = await api.post('/toProcess', { tx, params });
            return response.data;
        } catch (error) {
            console.error('toProcess error:', error);
            throw error;
        }
    },


    async createRecipe(args) { return this.toProcess(11, args); },
    async updateRecipe(args) { return this.toProcess(12, args); },
    async deleteRecipe(args) { return this.toProcess(13, args); },
    async getAllRecipesOfUser() { return this.toProcess(14); },
    async getRecipeById(args) { return this.toProcess(16, args); }, // if id == '' then well get all the recipes on db if we use a term then well search for it (well only use it for getting all the recipes for home)
    async searchRecipes(args) { return this.toProcess(15, args); },

    async getAllGroups(args) { return this.toProcess(21, args); },
    async createGroup(args) { return this.toProcess(22, args); },
    async deleteGroup(args) { return this.toProcess(23, args); },
    async updateGroup(args) { return this.toProcess(24, args); },

    async addRecipeToGroup(args) { return this.toProcess(25, args); },
    async removeRecipeFromGroup(args) { return this.toProcess(26, args); },
    async getRecipesInGroup(args) { return this.toProcess(27, args); },
    async getImage(args) { return this.toProcess(28, args); },

    async getFollow(args) { return this.toProcess(31, args); },
    async removeFollow(args) { return this.toProcess(32, args); },
    async getFollowers(args) { return this.toProcess(33, args); },
    async getFollowing(args) { return this.toProcess(34, args); }

}
