import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
type Row = [number,number,number];
type Board = [Row, Row, Row];

function startGame(): Board {
    return [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
}

function playGame(board: Board, row: number, col: number): Board {
    console.log('before board change', board[2]);
    board[row][col] = 1;
    console.log('after board change', board[2]);
    return board;
}


const typeDefs = `#graphql
  type Board {
    row1: [Int!]!
    row2: [Int!]!
    row3: [Int!]!
  }

  input BoardInput {
    row1: [Int!]!
    row2: [Int!]!
    row3: [Int!]!
  }

  type Mutation {
    playGame(board: BoardInput!, row: Int!, col: Int!): Board!
  }

  type Query {
    startGame: Board!
  }
`;

  const resolvers = {
    Query: {
      startGame: (): Board => startGame(),
    },
    Mutation: {
      playGame: (
        _parent: unknown,
        args: { board: { row1: number[]; row2: number[]; row3: number[] }; row: number; col: number }
      ): Board => {
        const currentBoard: Board = [
          args.board.row1 as [number, number, number],
          args.board.row2 as [number, number, number],
          args.board.row3 as [number, number, number],
        ];
        return playGame(currentBoard, args.row, args.col);
      },
    },
    Board: {
      row1: (board: Board) => board[0],
      row2: (board: Board) => board[1],
      row3: (board: Board) => board[2],
    },
  };


  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀  Server ready at: ${url}`);