// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title NatoCoin
 * @author Jules
 * @notice Este é um contrato de token ERC20 padrão para representar o $NATO para desenvolvimento local.
 * @dev Herda do contrato ERC20 da OpenZeppelin. No momento da implantação, 1.000.000 de tokens são criados e atribuídos ao `msg.sender`.
 */
contract NatoCoin is ERC20 {
    /**
     * @notice Construtor do contrato.
     * @dev Inicializa o token com o nome "Nato Coin" e o símbolo "NATO".
     * Cria 1.000.000 de tokens e os envia para o endereço que implantou o contrato.
     */
    constructor() ERC20("Nato Coin", "NATO") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}
