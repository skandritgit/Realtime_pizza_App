const Order=require("../../../models/order");

function AdminorderController(){
return {
    index(req,res){
       Order.find({status:{$ne:'completed'}},null,
            {sort:{'createdAt':-1}}
        ).populate('customerId','-password').then(order=>{
            if(req.xhr){
                return res.json(order)
    
            }
            else{
                res.render("admin/orders")
            }
            

        })

           
    
         
    
       
        
        }
    
}
}

module.exports=AdminorderController;