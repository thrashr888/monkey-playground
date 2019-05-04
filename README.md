# Monkey Playground

Messing around with [monkey-typescript](https://www.npmjs.com/package/monkey-typescript). Type some code, get the output.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

- npm start
- npm test
- npm run build

![ss](https://www.evernote.com/l/AAFq_mfEwARE_axN4zkAqaeAE6_139QFv1gB/image.png)

## Deploy

    $ aws s3 cp build/ s3://monkey.thrasher.dev/ --recursive --acl public-read-write
