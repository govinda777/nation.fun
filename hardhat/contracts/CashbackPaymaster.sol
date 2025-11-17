// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IEntryPoint} from "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import {PackedUserOperation} from "@account-abstraction/contracts/interfaces/PackedUserOperation.sol";
import {BasePaymaster} from "@account-abstraction/contracts/core/BasePaymaster.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CashbackPaymaster
 * @author Govinda
 * @notice Este contrato é um Paymaster de Abstração de Contas (ERC-4337) que patrocina as taxas de gás
 * para as transações dos usuários e os recompensa com um cashback de 1 token GovindasCoin (GVC) por operação.
 * @dev Herda de `BasePaymaster`, que por sua vez já inclui a funcionalidade de `Ownable`.
 * Ele precisa ser financiado com ETH (depositado no EntryPoint) para pagar o gás e com GVC
 * (depositado neste contrato) para distribuir as recompensas.
 */
contract CashbackPaymaster is BasePaymaster {
    /// @notice A instância do contrato ERC20 GovindasCoin usado para o cashback.
    IERC20 public govindasCoin;

    /**
     * @notice Construtor do contrato.
     * @param _govindasCoinAddress O endereço do contrato do token GovindasCoin (GVC).
     * @param _entryPoint O endereço do EntryPoint do ERC-4337.
     */
    constructor(address _govindasCoinAddress, IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {
        govindasCoin = IERC20(_govindasCoinAddress);
    }

    /**
     * @notice Valida se o Paymaster está disposto a pagar por uma UserOperation.
     * @dev Esta função é chamada pelo EntryPoint. Aqui, simplesmente codificamos o endereço do
     * remetente (`userOp.sender`) no `context` para que ele possa ser usado na função `_postOp`.
     * Retorna `0` para `validationData`, indicando que a validação não depende do tempo.
     * @param userOp A operação do usuário a ser validada.
     * @param userOpHash O hash da UserOperation.
     * @param maxCost O custo máximo que o Paymaster está disposto a pagar.
     * @return context Um `bytes` contendo o endereço do remetente, a ser passado para `_postOp`.
     * @return validationData Dados de validação (usado para validação dependente do tempo, aqui `0`).
     */
    function _validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    ) internal view override returns (bytes memory context, uint256 validationData) {
        return (abi.encode(userOp.sender), 0);
    }

    /**
     * @notice Executa a lógica de cashback após a transação do usuário ser concluída.
     * @dev Esta função é chamada pelo EntryPoint após a execução da UserOperation.
     * Ela decodifica o endereço do usuário do `context` e transfere 1 GVC para ele.
     * O Paymaster deve ter um saldo de GVC suficiente para que esta chamada tenha sucesso.
     * @param mode O modo da pós-operação (revert, success).
     * @param context O `context` retornado por `_validatePaymasterUserOp`, contendo o endereço do usuário.
     * @param actualGasCost O custo real do gás da transação.
     * @param actualUserOpFeePerGas A taxa de gás real por unidade de gás para a UserOperation.
     */
    function _postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost,
        uint256 actualUserOpFeePerGas
    ) internal override {
        address userAddress = abi.decode(context, (address));
        govindasCoin.transfer(userAddress, 1 * 10**18); // Envia 1 GVC (considerando 18 decimais)
    }

    /**
     * @notice Permite que qualquer pessoa deposite GVC neste contrato para financiar o programa de cashback.
     * @dev O chamador desta função deve primeiro aprovar este contrato a gastar a `amount` de GVC.
     * @param amount A quantidade de GVC a ser depositada (em wei, a menor unidade do token).
     */
    function depositGVC(uint256 amount) public {
        govindasCoin.transferFrom(msg.sender, address(this), amount);
    }

    /**
     * @notice Permite ao proprietário do contrato sacar ETH que foi enviado diretamente a este endereço.
     * @dev Função de segurança para resgatar fundos, restrita ao proprietário.
     * @param to O endereço para o qual o ETH será enviado.
     * @param amount A quantidade de ETH a ser sacada.
     */
    function withdrawEth(address payable to, uint256 amount) public payable onlyOwner {
        to.transfer(amount);
    }

    /**
     * @notice Função para receber ETH enviado diretamente ao contrato.
     */
    receive() external payable {}
}
