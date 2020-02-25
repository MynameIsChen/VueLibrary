<template>
    <div class="cut-content">
        <input ref="input" type="file" name="image" accept="image/*" @change="setImage"/>
        <div class="cut-img">
            <div class="item-bg" @click.prevent="showFileChooser(0)">
                <div class="item-add">+</div>
                <img class="img1" v-if="cropImg[0]" :src="cropImg[0]" alt="">
            </div>
            <div class="item-bg item-square" @click.prevent="showFileChooser(1)">
                <div class="item-add">+</div>
                <img class="img2" v-if="cropImg[1]" :src="cropImg[1]" alt="">
            </div>
            <div class="item-submit" @click="toSubmit">submit</div>
        </div>

        <div class="dialog" v-if="showCropper==1">
            <div class="dialog-content">
                <div class="cropper-content">
                    <vue-cropper
                            v-show="imgSrc"
                            ref="cropper"
                            :aspect-ratio="aspectRatio"
                            :src="imgSrc"
                            preview=".preview">
                    </vue-cropper>
                </div>
                <div class="dialog-footer">
                    <div class="preview-img">
                        <p>预览</p>
                        <div class="preview" :style="getPreviewStyle()"/>
                    </div>
                    <div class="dialog-buttons">
                        <div class="btn-item" @click.capture="cropImage">剪裁</div>
                        <div class="btn-item btn-top" @click.capture="showFileChooser()">重选</div>
                        <div class="btn-item btn-top" @click.capture="doCancel">取消</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import util from '../js/util';
    import http from '../js/http';
    import VueCropper from 'vue-cropperjs';
    import 'cropperjs/dist/cropper.css'

    export default {
        name: "CutImg",
        components: {VueCropper},
        data() {
            return {
                imgSrc: "",
                cropImg: [],
                showCropper: 0,
                aspectRatio: 16 / 9,
                type: 0,
            }
        },
        created() {
            // this.imgSrc = require("assets/icon.png");
        },
        methods: {
            getPreviewStyle() {
                return {
                    height: (3 / this.aspectRatio) + "rem"
                }
            },
            cropImage(e) {
                // get image data for post processing, e.g. upload or setting image src
                let canvasData = this.$refs.cropper.getCroppedCanvas();
                if (canvasData) {
                    this.cropImg[this.type] = canvasData.toDataURL();
                    this.showCropper = 0;
                    this.imgSrc = "";
                } else {
                    this.$layer.msg("请先选择图片");
                }

            },
            setImage(e) {
                console.log("setImage", e);
                const file = e.target.files[0];

                if (!file) {
                    //未选择图片
                    console.log("未选择图片");
                    return;
                }
                if (file.type.indexOf('image/') === -1) {
                    this.$layer.msg("请选择图片文件");//Please select an image file.
                    return;
                }
                // this.upload(file);

                if (typeof FileReader === 'function') {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.imgSrc = event.target.result;
                        // rebuild cropperjs with the updated source
                        this.$refs.cropper.replace(event.target.result);
                    };

                    reader.readAsDataURL(file);
                } else {
                    this.$layer.msg("Sorry, FileReader API not supported.");
                }
            },
            showFileChooser(type) {
                if (type) {
                    this.type = type;
                    this.aspectRatio = type == 0 ? 16 / 9 : 1 / 1;
                }
                this.showCropper = 1;
                this.$refs.input.click();
            },
            doCancel() {
                this.showCropper = 0;
                this.imgSrc = "";
            },
            //将base64转换为blob
            dataURLtoBlob: function (dataurl) {
                var arr = dataurl.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], {type: mime});
            },
            //将blob转换为file
            blobToFile: function (theBlob, fileName) {
                theBlob.lastModifiedDate = new Date();
                theBlob.name = fileName;
                return theBlob;
            },

            toSubmit() {
                var blob = this.dataURLtoBlob(this.cropImg[0]);
                var file = this.blobToFile(blob, new Date().getTime() + ".png");
                this.upload(file);
            },

            upload(file) {
                util.setSession("vote2women_token", "test");
                const formData = new FormData();
                formData.append("file", file);
                http._uploadImg(formData).then(data => {
                    console.log("_uploadImg", data);
                    if (data.data.status) {
                        let url = data.data.data + "?x-oss-process=image/format,png";
                        console.log("_uploadImg-img", url);
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .cut-content {
        width: 100%;
        height: 100%;
    }

    .cut-img {
        width: 100%;
        height: 100%;
    }

    input[type="file"] {
        display: none;
    }

    .item-bg, .img1 {
        width: 3rem;
        height: 2rem;
        background-color: #bababa;
    }

    .item-bg {
        position: relative;
    }

    .img1, .img2 {
        position: absolute;
        top: 0;
        left: 0;
    }

    .item-square, .img2 {
        width: 2rem;
        height: 2rem;
    }

    .item-square {
        margin-top: 0.2rem;
    }

    .item-add {
        height: 100%;
        line-height: 2rem;
        text-align: center;
        font-size: 0.64rem;
        color: #FFFFFF;
    }

    .item-submit {
        width: 2rem;
        height: 1rem;
        margin-top: 0.2rem;
        line-height: 1rem;
        text-align: center;
        font-size: 0.24rem;
        background-color: #409EFF;
    }

    .dialog-content {
        width: 100%;
        padding: 0.25rem;
        box-sizing: border-box;
    }

    .cropper-content {
        width: 100%;
        min-height: 3rem;
        background-color: #DDDDDD;
    }

    .dialog-footer {
        display: flex;
        align-items: flex-end;
    }

    .preview-img {
        width: 3rem;
        margin-top: 0.1rem;
        color: white;
        font-size: 0.28rem;
    }

    .preview {
        width: 100%;
        height: calc(372px * (9 / 16));
        overflow: hidden;
    }

    .dialog-buttons {
        flex: 1;
        float: right;
        margin-top: 0.2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .btn-top {
        margin-top: 0.2rem;
    }

    .btn-item {
        width: 2rem;
        height: 0.6rem;
        font-size: 0.24rem;
        color: #333333;
        background-color: white;
        line-height: 0.6rem;
        text-align: center;
        border-radius: 0.04rem;
    }
</style>
