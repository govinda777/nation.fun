// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockERC721
 * @author Govinda
 * @notice Contrato de NFT (ERC721) utilizado para fins de teste no ecossistema.
 * @dev Herda de `ERC721` e `Ownable` da OpenZeppelin. Apenas o proprietário do contrato pode criar novos NFTs.
 */
contract MockERC721 is ERC721, Ownable {
    /**
     * @notice Construtor do contrato.
     * @dev Inicializa o NFT com o nome "MockNFT", o símbolo "MNFT" e define o `msg.sender` como o proprietário.
     */
    constructor() ERC721("MockNFT", "MNFT") Ownable(msg.sender) {}

    /**
     * @notice Cria um novo NFT e o atribui a um endereço.
     * @dev Função restrita ao proprietário do contrato (`onlyOwner`). Utiliza a função `_safeMint` para garantir que o destinatário possa receber ERC721s.
     * @param to O endereço que receberá o novo NFT.
     * @param tokenId O ID único do novo NFT.
     */
    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }
}
