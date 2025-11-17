// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title GovindasCoin
 * @author Govinda
 * @notice Este é um contrato de token ERC20 padrão que serve como token de utilidade e recompensa no ecossistema Nation.fun.
 * @dev Herda do contrato ERC20 da OpenZeppelin. No momento da implantação, 1.000.000 de tokens são criados e atribuídos ao `msg.sender`.
 */
contract GovindasCoin is ERC20 {
    /**
     * @notice Construtor do contrato.
     * @dev Inicializa o token com o nome "Govindas Coin" e o símbolo "GVC".
     * Cria 1.000.000 de tokens e os envia para o endereço que implantou o contrato.
     */
    constructor() ERC20("Govindas Coin", "GVC") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}
