// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract LiquidityPool {
    using SafeMath for uint256;

    IERC20 public tokenA;
    IERC20 public tokenB;

    mapping(address => uint256) public liquidityProviders;
    uint256 public totalLiquidity;

    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB);

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(amountA > 0 && amountB > 0, "Invalid liquidity amounts");

        require(
            tokenA.transferFrom(msg.sender, address(this), amountA),
            "TokenA transfer failed"
        );
        require(
            tokenB.transferFrom(msg.sender, address(this), amountB),
            "TokenB transfer failed"
        );

        liquidityProviders[msg.sender] += amountA.add(amountB);
        totalLiquidity += amountA.add(amountB);

        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    function removeLiquidity(uint256 amount) external {
        require(
            liquidityProviders[msg.sender] >= amount,
            "Insufficient liquidity"
        );

        uint256 totalPoolLiquidity = tokenA.balanceOf(address(this)).add(
            tokenB.balanceOf(address(this))
        );

        uint256 withdrawA = amount.mul(tokenA.balanceOf(address(this))).div(totalPoolLiquidity);
        uint256 withdrawB = amount.mul(tokenB.balanceOf(address(this))).div(totalPoolLiquidity);

        liquidityProviders[msg.sender] -= amount;
        totalLiquidity -= amount;

        require(tokenA.transfer(msg.sender, withdrawA), "TokenA transfer failed");
        require(tokenB.transfer(msg.sender, withdrawB), "TokenB transfer failed");

        emit LiquidityRemoved(msg.sender, withdrawA, withdrawB);
    }
}