const Gallery = require("../models/gallery.model");

let  inMemorySession = {}

async function uploadConversation(conversation, ctx) {
    await ctx.reply("Rasmlarni oson topish uchun ularga avval nom berib chiqing\n\nmisol uchun oilaviy qizim men onam, bu joyda 4ta teg bor, va siz shu turdagi rasmlarni yuklaysiz. Bu teglar yordamida keyinchalik oson topib olishingiz ham mumkin bo'ladi\n\nbekor qilish uchun /cancel bosing");
    while (true) {
        const {message} = await conversation.wait();
        if (message?.text === '/cancel') {
            await ctx.reply("bekor qilindi");
            return;
        }
        if (!message?.text) {
            await ctx.reply("faqat matn shaklida yuboring");
        } else {
            inMemorySession[message.from.id] = {...inMemorySession[message.from.id], tags: message?.text.split(" ")};
            await ctx.reply("quyidagi teglar bilan nomlandi\n\n" + message?.text.split(' ').join("\n"))
            break;
        }
    }
    
    await ctx.reply("Yuklamoqchi bo'lgan rasmlaringizni rasm shaklida yuboring\n\nbekor qilish uchun /cancel bosing");
    while (true) {
        const {message} = await conversation.wait();
        if (message?.text === '/cancel') {
            await ctx.reply("bekor qilindi");
            return;
        }
        if (message?.text === '/done') {
            let files = [...inMemorySession[message.from.id]?.files];
            if (files.length > 0 && inMemorySession[message.from.id]?.tags.length > 0) {
                let galleryArray = [];
                for (let i = 0; i < files?.length; i++) {
                    galleryArray.push({
                        user_id: message.from.id,
                        file_id: files[i],
                        tags: inMemorySession[message.from.id]?.tags
                    })
                }    
                await Gallery.create(galleryArray);
                inMemorySession[message.from.id] = {};
                await ctx.reply("rasmlar saqlandi");
            } else {
                await ctx.reply("nimadir xato ketdi");
            }
            break;
        }
        if (message?.photo) {
            !inMemorySession[message.from.id]?.files ? inMemorySession[message.from.id] = {...inMemorySession[message.from.id], files: new Set()} : null;
            inMemorySession[message.from.id].files.add(message?.photo.slice(-1)[0].file_id);
            if (message?.media_group_id) {
                if (inMemorySession[message.from.id]?.media_group_id !== message?.media_group_id) {
                    await ctx.reply("rasmlar tugadimi? /done bosing, yokida jo'natishda davom eting");
                }
                inMemorySession[message.from.id] = {...inMemorySession[message.from.id], media_group_id: message?.media_group_id};
            } else {
                await ctx.reply("rasmlar tugadimi? /done bosing, yokida jo'natishda davom eting");
            }
        } else {
            await ctx.reply("faqat rasm shaklida yuboring");
        }
        
    }
}

async function upload(ctx) {
    await ctx.conversation.enter('uploadConversation');
}

module.exports = {upload, uploadConversation};