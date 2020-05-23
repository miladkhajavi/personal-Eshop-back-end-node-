const autoBind = require('auto-bind');
const {
    validationResult
} = require('express-validator');
const sprintf = require('sprintf');
module.exports = class controller {
    constructor() {
        autoBind(this)
    }
    async validationData(req, res) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            const errors = result.array();
            const message = [];
            errors.forEach(err => {
                message.push({
                    err: err.msg
                })
            })
            for (let i = 0; i < message.length; i++) {

                return res.json({
                    success: false,
                    msg: message
                })
            }

        }

        return true;
    }

    
    back(req, res) {
        return res.status(404).json({
            success: false,
            msg:'خطا در دریافت اطلاعات'
        });
    }
    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, '-')
    }

    

}