import { defineField, defineType } from "sanity";
export const notificationType = defineType({name:"notification",title:"Notification",type:"document",fields:[
  defineField({name:"title",title:"Title",type:"string",validation:R=>R.required()}),
  defineField({name:"message",title:"Message",type:"text",rows:2,validation:R=>R.required()}),
  defineField({name:"type",title:"Type",type:"string",options:{list:["success","info","warning","application","payment"]}}),
  defineField({name:"recipient",title:"Recipient",type:"string",initialValue:"admin"}),
  defineField({name:"application",title:"Application",type:"reference",to:[{type:"studentAdmission"}]}),
  defineField({name:"isRead",title:"Read",type:"boolean",initialValue:false}),
  defineField({name:"createdAt",title:"Created At",type:"datetime"}),
  defineField({name:"link",title:"Link",type:"string"}),
]});
