import mongoose from "mongoose";
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    summary: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    image_url: {
        type: String
    },
    plant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'plant',
        default: null
    },
    tags: [{
            type: String,
            trim: true
        }],
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    published_at: {
        type: Date
    }
}, { timestamps: true });
articleSchema.pre('save', function () {
    if (this.status === 'published' && !this.published_at) {
        this.published_at = new Date();
    }
});
const Article = mongoose.model('article', articleSchema);
Article.syncIndexes();
export default Article;
