const Order=require("../../../models/order")
const moment=require("moment");

function orderController(){
    return{
        async status(req,res){

            const {phone,address}=req.body;
             if(!phone || !address){
                req.flash('error',"All fields are required")
                return res.redirect('/cart');
             }

             const order=await Order.create({
                customerId:req.user._id,
                items:req.session.cart.items,
                phone,
                address,
             })

             order.save().then(async (result)=>{
            const data= await Order.populate(result,{ path:'customerId'})
            console.log(data);
            delete req.session.cart
               
                  req.flash('success','order placed successfully')
                  
                  //Emit
                  const eventEmitter=req.app.get('eventEmitter');
                  eventEmitter.emit('orderplaced', data)
  
                  return res.redirect('/customer/orders');

                  
              }).catch(err=>{
                req.flash('error',"Something went wrong");
                return res.redirect("/cart");
             })

        },
        async index(req,res){
         const order= await Order.find({customerId:req.user._id},
            null,
            {sort:{'createdAt':-1}}
            )
            res.header('Cache-Control', 'no-store')
            
         
     
         
        return res.render('customers/orders' ,{order,moment})
         
        },
        async show(req,res){
         const order=await Order.findById(req.params.id);

         try {
            if(req.user._id.toString()===order.customerId.toString()){
               res.render("customers/SingleOrder",{order})
            }
              else{
               return res.redirect("/");
              }
           
            
         } catch (error) {
            console.log(error)
         }

         


        }

    }
}


module.exports=orderController;