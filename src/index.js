import { GraphQLServer} from 'graphql-yoga'

// Challenge!

const posts = [
    {
        id:'1',
        title:'JPA Study',
        body:'jpa was so brilliant solution to access database!',
        published:true
    },
    {
        id:'2',
        title:'I preper mybatis than jpa',
        body:'jpa has a 1 level caching problem, so i like mybatis althoug its pretty annoying.',
        published:false
    },
    {
        id:'3',
        title:'What about React?',
        body:'react is a good front-end framework and most popular one in the world!',
        published:true
    }
]
// Type definitions (schema,datastructure)
const typeDefs = `
    type Query  {
      post(query:String):[Post!]!
    }

    type User {
        id: ID!
        name:String!
        email:String!
        age:Int
    }

    type Post {
        id:ID!
        title:String!
        body:String!
        published:Boolean!
    }
`
// Resolvers(function)
const resolvers = {
    Query:{
      post(parent,args,ctx,info){
          if(!args.query){
              return posts
          }

          return posts.filter((post)=>{
            return post.title.toLowerCase().includes(args.query.toLowerCase()) ||
                post.body.toLowerCase().includes(args.query.toLowerCase())
          })
      }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=>{
    console.log('The server is up')
})


// Demo user data
// const users = [
//     {
//         id:'1',
//         name:'Andrew',
//         email:'andrew@example.com',
//         age:27
//     },
//     {
//         id:'2',
//         name:'Sarah',
//         email:'sara@example.com'
//     },
//     {
//         id:'3',
//         name:'Jinsoo',
//         email:'jinsoo@example.com',
//         age:28
//     }
// ]

// // Type definitions (schema,datastructure)
// const typeDefs = `
//     type Query  {
//       users(query:String):[User!]!
//       me:User!
//     }

//     type User {
//         id: ID!
//         name:String!
//         email:String!
//         age:Int
//     }

//     type Post {
//         id:ID!
//         title:String!
//         body:String!
//         published:Boolean!
//     }
// `
// // Resolvers(function)
// const resolvers = {
//     Query:{
//         me(parent,args,ctx,info){
//             return {
//                 id:'myId',
//                 name:'jinsoo',
//                 age:28,
//                 email:'roorooro9933@gmail.com'
//             }
//         },
//         users(parent,args,ctx,info){
//             if(!args.query){
//                 return users
//             }

//             return users.filter((user)=>{
//                 return user.name.toUpperCase().includes(args.query.toUpperCase())
//             })
//         }
//     }
// }

// const server = new GraphQLServer({
//     typeDefs,
//     resolvers
// })

// server.start(()=>{
//     console.log('The server is up')
// })


