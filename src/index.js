import { GraphQLServer} from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Demo user data
let users = [
    {
        id:'1',
        name:'Andrew',
        email:'andrew@example.com',
        age:27
    },
    {
        id:'2',
        name:'Sarah',
        email:'sara@example.com'
    },
    {
        id:'3',
        name:'Jinsoo',
        email:'jinsoo@example.com',
        age:28
    }
]

// Demo post data
let posts = [
    {
     id:'100',
     title:'Leaning JPA',
     body:'Learning JPA for fun',
     published : false,
     author:'1'
    },
    {
        id:'101',
        title:'Leaning Hibernate',
        body:'Learning Hibernate for fun',
        published : false,
        author:'1'
    }
    ,
    {
        id:'102',
        title:'React is fun',
        body:'Why dont you leanrn progrmming skills',
        published : true,
        author:'2'
    }
]

// Demo comment data

let comments = [
    {
        id:'1001',
        text:'comment from 1001 id',
        author:'1',
        post:'100'
    },
    {
        id:'1002',
        text:'comment from 1002 id',
        author:'1',
        post:'100'
    },
    {
        id:'1003',
        text:'comment from 1003 id',
        author:'2',
        post:'101'
    },
    {
        id:'1004',
        text:'comment from 1004 id',
        author:'3',
        post:'102'
    }
]

// Type definitions (schema,datastructure)
const typeDefs = `
    type Query  {
      users(query:String):[User!]!
      post:[Post!]!
      me:User!
      comments:[Comment!]!
    }

    type Mutation {
        createUser(data:CreateUserInput!): User!
        deleteUser(id:ID!):User!
        createPost(data:CreatePostInput!):Post!
        createComment(data:CreateCommentInput!):Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput{
        title:String!
        body:String!
        published:Boolean!
        author:ID!
    }

    input CreateCommentInput{
        text:String!
        author:ID!
        post:ID!
    }

    type User {
        id: ID!
        name:String!
        email:String!
        age:Int
        posts:[Post!]!
        comments:[Comment!]!
    }

    type Post {
        id:ID!
        title:String!
        body:String!
        published:Boolean!
        author:User!
        comments:[Comment!]!
    }

    type Comment {
        id:ID!
        text:String!
        author:User!
        post:Post!
    }
`
// Resolvers(function)
const resolvers = {
    Query:{
        me(parent,args,ctx,info){
            return {
                id:'myId',
                name:'jinsoo',
                age:28,
                email:'roorooro9933@gmail.com'
            }
        },
        users(parent,args,ctx,info){
            if(!args.query){
                return users
            }

            return users.filter((user)=>{
                return user.name.toUpperCase().includes(args.query.toUpperCase())
            })
        },
        post(parent,args,ctx,info){
            return posts
        },
        comments(parent,args,ctx,info){
            return comments
        }
    },
    Mutation:{
        createUser(parent,args,ctx,info){
            // 같은 이메일을 가진 사람이 있냐를 알 수 있는 메소드
            const emailTaken = users.some((user)=> user.email === args.data.email)

            if(emailTaken){
                throw new Error('Email taken.')
            }

            const user = {
                id:uuidv4(),
                ...args.data
            }

            users.push(user)

            return user
        },
        deleteUser(parent,args,ctx,info){
            const userIndex = users.findIndex((user)=> user.id === args.id)

            /* 일치하는 idx가 없을떄는 -1을 return 한다는 것을
            알아두면된다. */ 
            if(userIndex === -1){
                throw new Error('User not found')
            }

            // splice는 첫번째 argument를 시작으로 두번째 argument 갯수만큼 지운다는 것이고,
            // return 값으로는 지워진 것들의 array를 return 한다.
            // 그래서 return deletedUser[0] 을 한것이다.
            const deletedUser = users.splice(userIndex,1)

            /* 이게 끝은 아니다 왜나하면은 user에 걸려있는 모든 post와comment를
            날려줘야 정합성이 맞는 데이터가 생긴다 하는 것이다. */

            posts = posts.filter((post)=>{
                const match = post.author === args.id

                if(match){
                    comments = comments.filter((comment)=>comment.post !== post.id)
                }

                return !match
            })

            /* 이러한 것을 사용하기 위해서
            comments를 let으로 바꿔 놨다는 것을 이해하자.
            왜냐하면 새로운 Object를 등록하는 것이기 때문에 const로 하면은 error가 날 것이다. */
            comments = comment.filter((comment)=>comment.author !== args.id)

            return deletedUser[0]
        },
        createPost(parent,args,ctx,info){
            const userExists = users.some((user)=> user.id === args.data.author)
            
            if(!userExists){
                throw new Error('User not found')
            }

            const post = {
                id:uuidv4(),
                ...args.data
            }

            posts.push(post)

            return post
        },
        createComment(parent,args,ctx,info){
            const userExist = users.some((user) => user.id === args.data.author)
            const postExist = posts.some((post)=> post.id === args.data.post)

            if(!userExist && !postExist){
                throw new Error('User or Post doenst exist')
            }

            const comment = {
                id:uuidv4(),
                ...args.data
            }

            return comment
        }
    },
    Post:{
        // 모든 post들이 이 author method를 call 할 것이다.
        author(parent,args,ctx,info){
            return users.find((user)=>{
                return user.id === parent.author
            })
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment)=>{
                return parent.post === post.id
            })
        }
    },
    User:{
        posts(parent,args,ctx,info){
            return posts.filter((post)=>{
                return post.author === parent.id
            })
        },
        // User안에 있는 comments는 이 return 값으로 해라 라는 뜻.
        comments(parent,args,ctx,info){
            return comments.filter((comment)=>{
                return comment.author === parent.id
            })
        }
    },
    Comment:{
        author(parent,args,ctx,info){
            return users.find((user)=>{
                return user.id === parent.author
            })
        },
        post(parent,args,ctx,info){
            return posts.find((post)=>{
                return post.id === comment.post
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


