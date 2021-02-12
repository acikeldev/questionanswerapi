const asyncErrorWrapper = require("express-async-handler");
const {searchHelper,paginationHelper} = require("./queryMiddlewareHelpers");


const userQueryMiddleware =  function(model,options){

    return asyncErrorWrapper(async (req,res,next)=>{
        //initial query
        let query  = model.find();
        query = searchHelper("name",query,req);
        const total = await model.countDocuments();
        const paginationResult = await paginationHelper(total,query,req);
        query = paginationResult.query;
        const pagination = paginationResult.pagination;
        const queryResults = await query;
        res.queryResults = {
            success:true,
            count:queryResults.length,
            pagination:pagination,
            data:queryResults
        }
        next();
    })
}

module.exports = userQueryMiddleware;