const srcDir = `${ __dirname }/src`;
const stylesDir = `${ srcDir }/styles`;

const distDir = './public';

module.exports = {
  styles: {
    src: `${ stylesDir }/bingo.scss`,
    dist: `${ distDir }/styles`,
  },
};
