import { Chain as ChainType } from '../../types/chain';
import Wallet from '../wallet';
import Ether from '../chains/ether';

class ChainFactory {
  static getChainByType(chain: ChainType) {
    switch (chain) {
      case 'ETHER':
        return new Wallet<Ether>(new Ether());

      default:
        throw new Error('Vehicle not supported');
    }
  }
}

export default ChainFactory;
